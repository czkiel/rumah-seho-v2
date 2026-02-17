// frontend/src/app/dashboard/sales/create/page.js
"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiSave, FiFileText, FiUser, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function CreateManualInvoice() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State Form Lengkap (Kuasa Penuh Admin)
  const [formData, setFormData] = useState({
    invoice_number: "", // Bisa dikosongkan untuk auto-generate
    transaction_date: new Date().toISOString().split('T')[0], // Default hari ini
    due_date: "",
    customer_name: "",
    customer_address: "",
    customer_phone: "",
    description: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Logic Cart (Tambah Produk)
  const addToCart = (productId) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) return;

    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      // Masukkan ke cart dengan harga default, tapi bisa diedit nanti
      setCart([...cart, { productId: product.id, name: product.name, price: product.price, qty: 1 }]);
    }
  };

  // Logic Ubah Qty di Cart
  const updateQty = (index, newQty) => {
    const newCart = [...cart];
    newCart[index].qty = parseInt(newQty) || 1;
    setCart(newCart);
  };

  // Logic Ubah Harga (Admin Power) di Cart
  const updatePrice = (index, newPrice) => {
    const newCart = [...cart];
    newCart[index].price = parseInt(newPrice) || 0;
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Silakan tambahkan minimal satu produk ke invoice!");
    
    setLoading(true);
    try {
      const payload = {
        items: cart,
        ...formData
      };
      
      const res = await axios.post("/sales/manual", payload);
      router.push(`/invoice/${res.data.saleId}`);
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal membuat invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-stone-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-950 font-serif flex items-center gap-3">
                <FiFileText className="text-emerald-700" />
                Buat Invoice Manual
            </h1>
            <p className="text-stone-500 mt-2">Buat tagihan kustom dengan kontrol penuh atas harga, tanggal, dan data pelanggan.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* KOLOM KIRI: SETTING INVOICE & CUSTOMER (Span 4) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Box 1: Info Invoice */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
                <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <FiCalendar className="text-emerald-600" /> Pengaturan Invoice
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">No. Invoice (Opsional)</label>
                        <input type="text" name="invoice_number" placeholder="Auto-generate jika kosong" className="input input-bordered w-full mt-1 bg-stone-50 border-emerald-100 focus:border-emerald-500 text-sm" onChange={handleChange} value={formData.invoice_number} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Tgl Transaksi</label>
                            <input type="date" name="transaction_date" className="input input-bordered w-full mt-1 bg-stone-50 border-emerald-100 focus:border-emerald-500 text-sm" onChange={handleChange} value={formData.transaction_date} required />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Jatuh Tempo</label>
                            <input type="date" name="due_date" className="input input-bordered w-full mt-1 bg-stone-50 border-emerald-100 focus:border-emerald-500 text-sm" onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Box 2: Info Pelanggan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
                <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <FiUser className="text-emerald-600" /> Detail Pelanggan
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nama Pelanggan <span className="text-red-500">*</span></label>
                        <input type="text" name="customer_name" required placeholder="Masukkan nama..." className="input input-bordered w-full mt-1 bg-stone-50 border-emerald-100 focus:border-emerald-500 text-sm" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">No. WhatsApp / Telp</label>
                        <input type="text" name="customer_phone" placeholder="08..." className="input input-bordered w-full mt-1 bg-stone-50 border-emerald-100 focus:border-emerald-500 text-sm" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Alamat Lengkap</label>
                        <textarea name="customer_address" className="textarea textarea-bordered w-full mt-1 bg-stone-50 border-emerald-100 focus:border-emerald-500 text-sm" rows="2" placeholder="Alamat pengiriman..." onChange={handleChange}></textarea>
                    </div>
                </div>
            </div>
            
            {/* Box 3: Catatan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Instruksi Khusus / Info Bank</label>
                <textarea name="description" className="textarea textarea-bordered w-full bg-stone-50 border-emerald-100 focus:border-emerald-500 text-sm" rows="4" placeholder="Tulis instruksi pembayaran, nomor rekening, atau cara penyimpanan produk di sini..." onChange={handleChange}></textarea>
            </div>

          </div>

          {/* KOLOM KANAN: PILIH PRODUK & CART (Span 8) */}
          <div className="xl:col-span-8 space-y-6 flex flex-col">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">
                    <FiDollarSign className="text-emerald-600 bg-emerald-100 p-1 rounded-full text-3xl" /> 
                    Daftar Produk & Tagihan
                </h2>
                
                {/* Input Pilih Produk */}
                <div className="flex gap-2 mb-6">
                    <select 
                        className="select select-bordered flex-1 bg-stone-50 border-emerald-200 focus:border-emerald-600 font-medium text-emerald-950"
                        onChange={(e) => {
                            addToCart(e.target.value);
                            e.target.value = ""; // Reset setelah pilih
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>+ Tambah Produk ke Invoice...</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} (Harga Asli: Rp {p.price.toLocaleString()})</option>
                        ))}
                    </select>
                </div>

                {/* Tabel Cart */}
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-emerald-800 text-emerald-900 text-sm uppercase tracking-wider">
                                <th className="py-3 px-2 font-bold">Produk</th>
                                <th className="py-3 px-2 font-bold text-center w-24">Qty</th>
                                <th className="py-3 px-2 font-bold text-right w-40">Harga (Rp)</th>
                                <th className="py-3 px-2 font-bold text-right w-40">Subtotal</th>
                                <th className="py-3 px-2 text-center w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-stone-400 italic">
                                        Belum ada produk yang ditambahkan.
                                    </td>
                                </tr>
                            ) : (
                                cart.map((item, idx) => (
                                    <tr key={idx} className="border-b border-stone-100 hover:bg-emerald-50/30 transition-colors group">
                                        <td className="py-3 px-2">
                                            <p className="font-bold text-emerald-950">{item.name}</p>
                                        </td>
                                        <td className="py-3 px-2">
                                            <input 
                                                type="number" 
                                                min="1"
                                                className="input input-sm input-bordered w-full text-center bg-white border-emerald-200 focus:border-emerald-500 font-mono"
                                                value={item.qty}
                                                onChange={(e) => updateQty(idx, e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-2">
                                            {/* ADMIN BISA UBAH HARGA DI SINI */}
                                            <input 
                                                type="number" 
                                                min="0"
                                                className="input input-sm input-bordered w-full text-right bg-white border-emerald-200 focus:border-emerald-500 font-mono font-medium text-emerald-700"
                                                value={item.price}
                                                onChange={(e) => updatePrice(idx, e.target.value)}
                                                title="Ubah harga satuan jika perlu"
                                            />
                                        </td>
                                        <td className="py-3 px-2 text-right font-mono font-bold text-emerald-900">
                                            Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <button type="button" onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Total & Submit */}
                <div className="mt-6 pt-6 border-t border-emerald-100 flex flex-col items-end">
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 min-w-[300px] w-full md:w-auto">
                        <div className="flex justify-between items-center mb-2 text-stone-500 font-medium">
                            <span>Subtotal Item:</span>
                            <span>{cart.length} Produk</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-emerald-950">Grand Total:</span>
                            <span className="text-3xl font-bold text-emerald-700 font-serif">
                                Rp {calculateTotal().toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || cart.length === 0}
                        className="btn mt-6 bg-emerald-800 hover:bg-emerald-950 text-white border-none rounded-xl px-8 w-full md:w-auto shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <>
                                <FiSave className="mr-2" size={20} />
                                Simpan & Terbitkan Invoice
                            </>
                        )}
                    </button>
                </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}