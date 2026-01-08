// src/app/invoice/[id]/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

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
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="loading loading-spinner loading-lg text-orange-600 mb-4"></div>
            <p className="text-gray-600">Memuat invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <svg
                className="w-24 h-24 mx-auto text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Invoice Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "Invoice tidak ditemukan"}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.back()}
                  className="btn btn-outline rounded-xl">
                  Kembali
                </button>
                <Link href="/shop" className="btn btn-primary rounded-xl">
                  Ke Toko
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Detail Invoice
              </h1>
              <p className="text-sm text-gray-500">
                {sale.invoice_number} •{" "}
                {new Date(sale.transaction_date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-xl shadow-lg hover:shadow-xl transition-all">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Download / Cetak PDF
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Document (Printable Area) */}
        <div
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up"
          ref={componentRef}>
          <div className="p-8 md:p-12">
            {/* Header / KOP */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-orange-500 pb-6 mb-8">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <img
                  src="/logo.png"
                  alt="Rumah Seho Logo"
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h1 className="text-3xl font-bold text-orange-600 uppercase tracking-wider">
                    RUMAH SEHO
                  </h1>
                  <p className="text-lg font-semibold text-orange-500 tracking-wider">
                    NUSANTARA
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    PT. Rumah Seho Nusantara
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right text-sm text-gray-600">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  INVOICE
                </h2>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 sm:justify-end">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    089698882428
                  </p>
                  <p className="flex items-center gap-2 sm:justify-end">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    rumahseho@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Info Invoice & Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase mb-2">
                  Tagihan Kepada:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {sale.user.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {sale.user.address}
                  </p>
                  <p className="text-gray-600 text-sm">{sale.user.phone}</p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">
                      Nomor Invoice
                    </p>
                    <p className="font-bold text-lg text-gray-900">
                      {sale.invoice_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">
                      Tanggal Transaksi
                    </p>
                    <p className="text-gray-900">
                      {new Date(sale.transaction_date).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">
                      Jatuh Tempo
                    </p>
                    <p className="font-bold text-red-600">
                      {new Date(sale.due_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel Produk */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-linear-to-r from-orange-500 to-orange-600 text-white">
                    <th className="py-4 px-4 text-left font-semibold">
                      Produk
                    </th>
                    <th className="py-4 px-4 text-left font-semibold hidden md:table-cell">
                      Deskripsi
                    </th>
                    <th className="py-4 px-4 text-center font-semibold">Qty</th>
                    <th className="py-4 px-4 text-right font-semibold">
                      Harga Satuan
                    </th>
                    <th className="py-4 px-4 text-right font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {sale.sale_items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}>
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        {item.product.name}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 hidden md:table-cell">
                        {item.product.description || "-"}
                      </td>
                      <td className="py-4 px-4 text-center">{item.qty}</td>
                      <td className="py-4 px-4 text-right">
                        Rp {item.price_at_purchase.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Harga */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-2/3">
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-700">
                      Total Tagihan
                    </span>
                    <span className="text-3xl font-bold text-orange-600">
                      Rp {sale.total_price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-2">
                    *Harap lakukan pembayaran sesuai nominal di atas
                  </p>
                </div>
              </div>
            </div>

            {/* Footer / Info Rekening */}
            <div className="bg-linear-to-r from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200 mb-8">
              <h4 className="font-bold text-orange-900 text-lg mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Info Pembayaran
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Pembayaran dapat dilakukan secara{" "}
                <strong>COD (Cash on Delivery)</strong> atau Transfer Bank ke
                rekening berikut:
              </p>
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <p className="font-bold text-xl text-gray-900 mb-1">
                  Bank BRI: 0054-0115-4077-508
                </p>
                <p className="text-sm text-gray-600">
                  a/n Veronika Theresia Taliwongso
                </p>
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="mt-12 text-right">
              <p className="mb-20 text-gray-600">Hormat Kami,</p>
              <div className="inline-block">
                <p className="font-bold text-lg underline mb-1">
                  Veronika Theresia Taliwongso
                </p>
                <p className="text-sm text-gray-500">
                  PT. Rumah Seho Nusantara
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="max-w-4xl mx-auto mt-6">
          <Link
            href="/shop"
            className="btn btn-outline rounded-xl inline-flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Toko
          </Link>
        </div>
      </div>
    </div>
  );
}
