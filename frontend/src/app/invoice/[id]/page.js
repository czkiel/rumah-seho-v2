// src/app/invoice/[id]/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import Navbar from "../../../components/Navbar"; // Navbar tetap ada, tapi warna akan menyesuaikan
import Link from "next/link";
import Image from "next/image"; // Gunakan Next Image jika logo ada di public

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [sale, setSale] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const componentRef = useRef();

  useEffect(() => {
    const getInvoice = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await axios.get(`/sales/${id}`);
        setSale(response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(
          error.response?.data?.msg ||
            "Invoice tidak ditemukan atau terjadi kesalahan"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getInvoice();
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: sale ? `Invoice-${sale.invoice_number}` : `Invoice-${id}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-emerald-800 mb-4"></div>
          <p className="text-emerald-900 font-serif tracking-widest">MEMUAT INVOICE...</p>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-emerald-100">
          <h2 className="text-2xl font-bold text-emerald-900 mb-2 font-serif">
            Invoice Tidak Ditemukan
          </h2>
          <p className="text-stone-600 mb-6">
            {error || "Data invoice tidak tersedia."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="btn btn-outline border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white rounded-lg">
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tentukan data customer: Prioritas Customer Manual, jika tidak ada baru ambil dari User yang login
  const customerName = sale.customer_name || sale.user?.name || "-";
  const customerAddress = sale.customer_address || sale.user?.address || "-";
  const customerPhone = sale.customer_phone || sale.user?.phone || "-";

  return (
    <div className="min-h-screen bg-stone-100 pb-20 font-sans">
      <Navbar /> 

      <div className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="max-w-4xl mx-auto mb-6 no-print">
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-emerald-950 mb-1 font-serif">
                Detail Invoice
              </h1>
              <p className="text-sm text-emerald-600/70">
                {sale.invoice_number}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="btn bg-emerald-800 hover:bg-emerald-900 text-white border-none rounded-lg shadow-md transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh PDF
            </button>
          </div>
        </div>

        {/* Invoice Document (Printable Area) */}
        <div
          className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden print:shadow-none"
          ref={componentRef}>
          
          {/* Decorative Top Border */}
          <div className="h-4 bg-emerald-900 w-full"></div>

          <div className="p-8 md:p-12">
            {/* Header / KOP */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-emerald-900/20 pb-8 mb-8">
              <div className="flex items-center gap-5 mb-6 sm:mb-0">
                {/* Logo */}
                <div className="relative w-20 h-20">
                    <img src="/logo.png" alt="Logo" className="object-contain w-full h-full" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-emerald-900 uppercase tracking-widest font-serif">
                    RUMAH SEHO
                  </h1>
                  <p className="text-sm font-semibold text-emerald-700 tracking-widest uppercase">
                    Nusantara
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    PT. Rumah Seho Nusantara
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right text-stone-600">
                <h2 className="text-4xl font-bold text-emerald-900/10 absolute right-12 top-12 select-none pointer-events-none">
                  INVOICE
                </h2>
                <div className="space-y-1 text-sm relative z-10">
                  <p className="font-medium text-emerald-900">Kontak Kami:</p>
                  <p>089698882428</p>
                  <p>rumahseho@gmail.com</p>
                  <p>Manado, Indonesia</p>
                </div>
              </div>
            </div>

            {/* Info Invoice & Customer */}
            <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                  Ditagihkan Kepada
                </p>
                <div className="text-stone-800">
                  <h3 className="font-bold text-xl text-emerald-950 font-serif mb-1">
                    {customerName}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-xs text-stone-600">
                    {customerAddress}
                  </p>
                  <p className="text-sm text-stone-600 mt-1">{customerPhone}</p>
                </div>
              </div>

              <div className="flex-1 md:text-right">
                <div className="inline-block text-left md:text-right space-y-3">
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Nomor Invoice
                    </p>
                    <p className="font-mono text-lg text-stone-900">
                      {sale.invoice_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Tanggal
                    </p>
                    <p className="text-stone-900">
                      {new Date(sale.transaction_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Jatuh Tempo
                    </p>
                    <p className="font-bold text-red-700">
                      {new Date(sale.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel Produk */}
            <div className="mb-10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-emerald-900">
                    <th className="py-3 px-2 text-left font-bold text-emerald-900 text-sm uppercase tracking-wider">Produk</th>
                    <th className="py-3 px-2 text-center font-bold text-emerald-900 text-sm uppercase tracking-wider">Qty</th>
                    <th className="py-3 px-2 text-right font-bold text-emerald-900 text-sm uppercase tracking-wider">Harga</th>
                    <th className="py-3 px-2 text-right font-bold text-emerald-900 text-sm uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="text-stone-700">
                  {sale.sale_items.map((item) => (
                    <tr key={item.id} className="border-b border-stone-100 hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4 px-2">
                        <p className="font-semibold text-emerald-950">{item.product.name}</p>
                        <p className="text-xs text-stone-500 italic mt-0.5">{item.product.description || ""}</p>
                      </td>
                      <td className="py-4 px-2 text-center font-mono">{item.qty}</td>
                      <td className="py-4 px-2 text-right font-mono text-stone-600">
                        Rp {item.price_at_purchase.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-2 text-right font-mono font-medium text-emerald-900">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div className="flex justify-end mb-12">
              <div className="w-full md:w-1/2 bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-emerald-900 font-serif">TOTAL TAGIHAN</span>
                  <span className="text-2xl font-bold text-emerald-800">
                    Rp {sale.total_price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Description / Notes */}
            <div className="border-t border-stone-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Kolom Kiri: Deskripsi / Instruksi (Menggantikan Info Pembayaran Statis) */}
              <div className="text-sm text-stone-600">
                 <h4 className="font-bold text-emerald-900 mb-2 uppercase text-xs tracking-wider">
                    Catatan & Instruksi
                 </h4>
                 {sale.description ? (
                    <div className="whitespace-pre-line leading-relaxed p-4 bg-stone-50 rounded border border-stone-100">
                        {sale.description}
                    </div>
                 ) : (
                    <p className="italic text-stone-400">Tidak ada catatan tambahan.</p>
                 )}
              </div>

              {/* Kolom Kanan: Tanda Tangan */}
              <div className="text-center md:text-right mt-4 md:mt-0">
                <p className="text-stone-500 text-sm mb-16">Dibuat di Manado,</p>
                <div className="inline-block text-center">
                    <p className="font-bold text-emerald-950 underline decoration-emerald-300 decoration-2 underline-offset-4">
                        Veronika T. Taliwongso
                    </p>
                    <p className="text-xs text-emerald-700 mt-1 font-semibold">
                        Owner
                    </p>
                </div>
              </div>

            </div>
          </div>
          
          {/* Decorative Bottom */}
          <div className="h-2 bg-gradient-to-r from-emerald-800 to-emerald-600 w-full"></div>
        </div>
      </div>
    </div>
  );
}