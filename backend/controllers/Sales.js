import Sales from "../models/SaleModel.js";
import SaleItems from "../models/SaleItemModel.js";
import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import db from "../config/database.js";
import { Op } from "sequelize";

// GET ALL SALES (Untuk Laporan Admin)
export const getSales = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            // Admin bisa lihat semua data dan user yang beli
            response = await Sales.findAll({
                attributes: ['uuid', 'invoice_number', 'transaction_date', 'total_price', 'status'],
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            // Customer cuma bisa lihat transaksinya sendiri
            response = await Sales.findAll({
                attributes: ['uuid', 'invoice_number', 'transaction_date', 'total_price', 'status'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// GET SINGLE SALE (Untuk Data Invoice PDF)
export const getSaleById = async (req, res) => {
    try {
        const sale = await Sales.findOne({
            where: {
                uuid: req.params.id
            },
            include: [
                {
                    model: Users, // Data Customer (Utk: "Tagihan Kepada")
                    attributes: ['name', 'address', 'phone', 'email'] 
                },
                {
                    model: SaleItems, // Data Barang (Utk: Tabel Produk)
                    include: [{
                        model: Products,
                        attributes: ['name', 'description']
                    }]
                }
            ]
        });

        if(!sale) return res.status(404).json({msg: "Transaksi tidak ditemukan"});

        // Validasi akses: Cuma Admin atau Pemilik Transaksi yang boleh lihat
        if(req.role !== "admin" && sale.userId !== req.userId){
            return res.status(403).json({msg: "Akses terlarang"});
        }

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// CREATE SALE (Checkout) -> INI LOGIC UTAMANYA
export const createSale = async (req, res) => {
    // Input dari Frontend: items = [{productId: 1, qty: 2}, {productId: 5, qty: 1}]
    const { items } = req.body; 
    
    // Mulai Database Transaction (Safety)
    const t = await db.transaction();

    try {
        let totalPrice = 0;
        const saleItemsData = [];

        // 1. Loop items untuk hitung total & validasi harga terbaru dari DB
        for (const item of items) {
            const product = await Products.findOne({ where: { id: item.productId } });
            if (!product) {
                await t.rollback(); // Batalkan semua jika produk ga ada
                return res.status(404).json({msg: `Product ID ${item.productId} tidak ditemukan`});
            }

            const subtotal = product.price * item.qty;
            totalPrice += subtotal;

            saleItemsData.push({
                productId: product.id,
                qty: item.qty,
                price_at_purchase: product.price, // Simpan harga saat ini (agar aman kalau harga naik besok)
                subtotal: subtotal
            });
        }

        // 2. Generate Nomor Invoice (Format: INV/BulanTahun/UnixTimestamp)
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const invoiceNumber = `INV/${month}${year}/${Date.now().toString().slice(-4)}`;

        // 3. Hitung Jatuh Tempo (H+7 hari) sesuai contoh invoice
        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 7);

        // 4. Simpan Header Transaksi (Tabel Sales)
        const newSale = await Sales.create({
            invoice_number: invoiceNumber,
            total_price: totalPrice,
            userId: req.userId, // Ambil ID dari session login
            due_date: dueDate
        }, { transaction: t });

        // 5. Simpan Detail Item (Tabel SaleItems) dengan ID Sale yang baru dibuat
        const finalSaleItems = saleItemsData.map(item => ({
            ...item,
            saleId: newSale.id
        }));

        await SaleItems.bulkCreate(finalSaleItems, { transaction: t });

        // Commit (Simpan Permanen)
        await t.commit();

        res.status(201).json({
            msg: "Transaksi Berhasil!", 
            saleId: newSale.uuid // Kirim UUID biar frontend bisa langsung redirect ke halaman Invoice
        });

    } catch (error) {
        await t.rollback(); // Batalkan semua jika ada error
        res.status(500).json({msg: error.message});
    }
}