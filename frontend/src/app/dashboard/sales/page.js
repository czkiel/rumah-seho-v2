// src/app/dashboard/sales/page.js
"use client";

import { useState, useEffect } from "react";
import axios from "../../../lib/axios";
import Link from "next/link";

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getSales();
  }, []);

  const getSales = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.customer_name && sale.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) || // Support untuk manual name
      (sale.user?.name && sale.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = sales.filter((sale) => {
    const saleDate = new Date(sale.transaction_date);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total_price, 0);

  return (
    <div className="space-y-6 animate-fade-in-up font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 mb-2 font-serif">
          Laporan Penjualan
        </h1>
        <p className="text-stone-600">
          Kelola dan pantau semua transaksi dari customer maupun manual.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Transaksi</p>
              <p className="text-3xl font-bold text-emerald-950">{sales.length}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <svg className="w-8 h-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Pendapatan</p>
              <p className="text-3xl font-bold text-emerald-700">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <svg className="w-8 h-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Hari Ini</p>
              <p className="text-3xl font-bold text-teal-700">
                {todaySales.length}
              </p>
              <p className="text-xs font-semibold text-teal-600/80 mt-1">
                Rp {todayRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-teal-50 p-3 rounded-xl border border-teal-100">
              <svg className="w-8 h-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-emerald-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-emerald-600/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan invoice atau nama..."
            className="input input-bordered border-emerald-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 w-full pl-12 rounded-xl bg-stone-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="loading loading-spinner loading-lg text-emerald-800 mb-4"></div>
            <p className="text-emerald-900 font-serif tracking-widest uppercase text-sm">MEMUAT DATA PENJUALAN...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-emerald-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-2xl font-bold text-emerald-950 mb-2 font-serif">
              {searchQuery ? "Transaksi Tidak Ditemukan" : "Belum Ada Transaksi"}
            </h3>
            <p className="text-stone-500">
              {searchQuery
                ? "Coba gunakan kata kunci pencarian yang lain."
                : "Transaksi akan otomatis muncul di sini."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-linear-to-r from-emerald-800 to-emerald-950 text-emerald-50 text-sm uppercase tracking-wider">
                  <th className="py-4">No</th>
                  <th className="py-4">No. Invoice</th>
                  <th className="py-4">Tanggal</th>
                  <th className="py-4">Pelanggan</th>
                  <th className="py-4 text-right">Total</th>
                  <th className="py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale, index) => {
                  // Cek apakah ini manual invoice (punya customer_name di database)
                  const isManual = !!sale.customer_name;
                  const customerName = sale.customer_name || sale.user?.name || "Unknown";
                  const customerEmail = isManual ? "(Invoice Manual)" : sale.user?.email || "-";

                  return (
                    <tr
                      key={sale.uuid}
                      className="border-b border-stone-100 hover:bg-emerald-50/50 transition-colors"
                    >
                      <td className="font-semibold text-stone-500">{index + 1}</td>
                      <td>
                        <div className="font-mono font-bold text-sm text-emerald-950">
                          {sale.invoice_number}
                        </div>
                        {isManual && <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Manual</span>}
                      </td>
                      <td>
                        <div className="text-sm font-medium text-stone-800">
                          {new Date(sale.transaction_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <div className="text-xs text-stone-500">
                          {new Date(sale.transaction_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-stone-900">{customerName}</div>
                        <div className={`text-xs ${isManual ? "text-emerald-600 font-medium italic" : "text-stone-500"}`}>
                          {customerEmail}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="font-bold text-lg text-emerald-700 font-mono">
                          Rp {sale.total_price.toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="text-center">
                        <Link
                          href={`/invoice/${sale.uuid}`}
                          className="btn btn-sm bg-emerald-800 hover:bg-emerald-950 text-white border-none rounded-lg shadow-md"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Lihat
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}