// src/app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    todaySales: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await axios.get("/me");
        setName(userResponse.data.name);

        if (userResponse.data.role !== "admin") {
          router.push("/shop");
          return;
        }

        const [productsRes, salesRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/sales"),
        ]);

        const products = productsRes.data;
        const sales = salesRes.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaySalesList = sales.filter((sale) => {
          const saleDate = new Date(sale.transaction_date);
          saleDate.setHours(0, 0, 0, 0);
          return saleDate.getTime() === today.getTime();
        });

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);
        const todayRevenue = todaySalesList.reduce((sum, sale) => sum + sale.total_price, 0);

        setStats({
          totalProducts: products.length,
          totalSales: sales.length,
          totalRevenue,
          todaySales: todaySalesList.length,
          todayRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Gradasi warna aesthetic ala Emerald/Teal
  const statCards = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "from-teal-600 to-teal-800",
      link: "/dashboard/products",
      description: "Varian Tersedia",
    },
    {
      title: "Total Penjualan",
      value: stats.totalSales,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-emerald-500 to-emerald-700",
      link: "/dashboard/sales",
      description: "Transaksi Sukses",
    },
    {
      title: "Penjualan Hari Ini",
      value: stats.todaySales,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-600 to-green-800",
      link: "/dashboard/sales",
      description: "Aktivitas Hari Ini",
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-emerald-800 to-emerald-950",
      link: "/dashboard/sales",
      description: "Gross Revenue",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-emerald-800 mb-4"></div>
          <p className="text-emerald-900 font-serif tracking-widest">MEMUAT DASHBOARD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-950 font-serif mb-2 tracking-tight">
              Selamat Datang, {name.split(' ')[0]}! 👋
            </h1>
            <p className="text-stone-600">
              Pantau aktivitas bisnis dan kelola data operasional dengan mudah.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/products"
              className="btn bg-emerald-800 hover:bg-emerald-900 text-white border-none rounded-xl shadow-lg shadow-emerald-900/20">
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Produk
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            href={card.link}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-emerald-50"
            style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`bg-linear-to-br ${card.color} p-6 text-white h-full relative`}>
              {/* Background Accent */}
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform">
                  {card.icon}
              </div>
              <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 rounded-xl p-3 backdrop-blur-md">
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-emerald-50 font-medium uppercase tracking-wider text-xs mb-1">{card.title}</p>
                    <p className="text-3xl font-bold">{card.value}</p>
                    <p className="text-white/70 text-xs mt-2">{card.description}</p>
                  </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Action Area Bawah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Actions (Ditambahkan Invoice Manual) */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100">
          <h2 className="text-xl font-bold text-emerald-950 mb-6 font-serif flex items-center gap-2 border-b border-emerald-50 pb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Akses Cepat
          </h2>
          <div className="space-y-4">
            
            {/* INI LINK KE MANUAL INVOICE YANG DIMINTA */}
            <Link
              href="/dashboard/sales/create"
              className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-800 p-3 rounded-lg text-white shadow-md group-hover:bg-emerald-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-emerald-950 text-lg">Buat Invoice Manual</p>
                  <p className="text-sm text-stone-500">
                    Buat tagihan khusus tanpa checkout user
                  </p>
                </div>
              </div>
              <svg className="w-6 h-6 text-emerald-300 group-hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/dashboard/products"
              className="flex items-center justify-between p-4 rounded-xl border border-stone-100 bg-white hover:bg-stone-50 hover:border-emerald-200 transition-all group">
              <div className="flex items-center gap-4">
                <div className="bg-stone-100 p-3 rounded-lg text-emerald-800 group-hover:bg-emerald-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-lg">Kelola Produk</p>
                  <p className="text-sm text-stone-500">
                    Tambah, edit, atau hapus produk
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>

       
      </div>
    </div>
  );
}