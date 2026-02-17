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
                    model: Users, 
                    attributes: ['name', 'address', 'phone', 'email'] 
                },
                {
                    model: SaleItems, 
                    include: [{
                        model: Products,
                        attributes: ['name', 'description']
                    }]
                }
            ]
        });

        if(!sale) return res.status(404).json({msg: "Transaksi tidak ditemukan"});

        // Validasi akses (Admin or Owner)
        // Jika userId null (manual invoice), hanya admin yang boleh lihat
        if(req.role !== "admin" && sale.userId && sale.userId !== req.userId){
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
export const createManualSale = async (req, res) => {
    // Menangkap semua input dari frontend, termasuk custom invoice number dan tanggal
    const { 
        items, 
        invoice_number, 
        transaction_date, 
        due_date, 
        customer_name, 
        customer_address, 
        customer_phone, 
        description 
    } = req.body;
    
    // Validasi akses admin
    if(req.role !== "admin") return res.status(403).json({msg: "Hanya admin yang dapat membuat invoice manual"});

    const t = await db.transaction();

    try {
        let totalPrice = 0;
        const saleItemsData = [];

        // 1. Loop items 
        for (const item of items) {
            const product = await Products.findOne({ where: { id: item.productId } });
            if (!product) {
                await t.rollback(); 
                return res.status(404).json({msg: `Product ID ${item.productId} tidak ditemukan`});
            }

            // Gunakan harga custom dari admin jika diubah, jika tidak pakai harga asli DB
            const finalPrice = item.price !== undefined && item.price !== "" ? Number(item.price) : product.price;
            const subtotal = finalPrice * item.qty;
            totalPrice += subtotal;

            saleItemsData.push({
                productId: product.id,
                qty: item.qty,
                price_at_purchase: finalPrice, // Simpan harga custom/asli
                subtotal: subtotal
            });
        }

        // 2. Logic Nomor Invoice & Tanggal
        const tDate = transaction_date ? new Date(transaction_date) : new Date();
        const month = String(tDate.getMonth() + 1).padStart(2, '0');
        const year = String(tDate.getFullYear()).slice(-2);
        
        // Jika admin tidak isi nomor invoice, kita auto-generate
        const autoInvoiceNumber = `INV/M/${month}${year}/${Date.now().toString().slice(-4)}`;
        const finalInvoiceNumber = invoice_number && invoice_number.trim() !== "" ? invoice_number : autoInvoiceNumber;

        // Jika admin tidak isi jatuh tempo, set default H+7 dari tanggal transaksi
        const dDate = new Date(tDate);
        const finalDueDate = due_date ? new Date(due_date) : new Date(dDate.setDate(dDate.getDate() + 7));

        // 3. Create Sale Record dengan semua data custom
        const newSale = await Sales.create({
            invoice_number: finalInvoiceNumber,
            transaction_date: tDate,
            total_price: totalPrice,
            userId: req.userId, // Admin yang membuat
            customer_name: customer_name || null,
            customer_address: customer_address || null,
            customer_phone: customer_phone || null,
            description: description || null,
            due_date: finalDueDate,
            status: 'pending'
        }, { transaction: t });

        // 4. Create Sale Items
        const finalSaleItems = saleItemsData.map(item => ({
            ...item,
            saleId: newSale.id
        }));

        await SaleItems.bulkCreate(finalSaleItems, { transaction: t });

        await t.commit();

        res.status(201).json({
            msg: "Invoice Manual Berhasil Dibuat!", 
            saleId: newSale.uuid 
        });

    } catch (error) {
        await t.rollback();
        // Cek jika error karena nomor invoice duplikat
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({msg: "Nomor Invoice sudah digunakan, silakan ganti yang lain."});
        }
        res.status(500).json({msg: error.message});
    }
}