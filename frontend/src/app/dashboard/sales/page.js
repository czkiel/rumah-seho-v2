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
      sale.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = sales.filter((sale) => {
    const saleDate = new Date(sale.transaction_date);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });
  const todayRevenue = todaySales.reduce(
    (sum, sale) => sum + sale.total_price,
    0
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Laporan Penjualan
        </h1>
        <p className="text-gray-600">
          Kelola dan pantau semua transaksi penjualan
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
              <p className="text-3xl font-bold text-gray-900">{sales.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
              <p className="text-3xl font-bold text-orange-600">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Penjualan Hari Ini</p>
              <p className="text-3xl font-bold text-green-600">
                {todaySales.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Rp {todayRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan invoice, nama, atau email..."
            className="input input-bordered w-full pl-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="loading loading-spinner loading-lg text-orange-600 mb-4"></div>
            <p className="text-gray-600">Memuat data penjualan...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {searchQuery ? "Transaksi tidak ditemukan" : "Belum ada transaksi"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Coba cari dengan kata kunci lain"
                : "Transaksi akan muncul di sini setelah customer melakukan checkout"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-linear-to-r from-orange-500 to-orange-600 text-white">
                  <th className="text-white">No</th>
                  <th className="text-white">No. Invoice</th>
                  <th className="text-white">Tanggal</th>
                  <th className="text-white">Pelanggan</th>
                  <th className="text-white text-right">Total</th>
                  <th className="text-white text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale, index) => (
                  <tr
                    key={sale.uuid}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <td className="font-semibold">{index + 1}</td>
                    <td>
                      <div className="font-mono font-bold text-sm text-gray-900">
                        {sale.invoice_number}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {new Date(sale.transaction_date).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(sale.transaction_date).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-gray-900">
                        {sale.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sale.user.email}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="font-bold text-lg text-orange-600">
                        Rp {sale.total_price.toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="text-center">
                      <Link
                        href={`/invoice/${sale.uuid}`}
                        className="btn btn-sm bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-xl"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Lihat Invoice
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}