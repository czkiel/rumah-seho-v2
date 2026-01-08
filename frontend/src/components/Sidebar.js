// src/components/Sidebar.js
"use client";

import axios from "../lib/axios";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/me");
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (!confirm("Yakin ingin logout?")) return;
    try {
      await axios.delete("/logout");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/dashboard/products",
      label: "Kelola Produk",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      href: "/dashboard/sales",
      label: "Laporan Penjualan",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="drawer lg:drawer-open z-20">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <aside className="w-80 min-h-full bg-linear-to-b from-orange-600 to-orange-700 text-white">
          {/* Header */}
          <div className="p-6 border-b border-orange-500/30">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Rumah Seho Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <p className="text-xs text-orange-100">Rumah Seho Nusantara</p>
              </div>
            </div>
            {userName && (
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{userName}</span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <ul className="menu p-4 gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-white text-orange-600 font-semibold shadow-lg"
                        : "text-orange-100 hover:bg-orange-500/50 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}

            <div className="divider my-4 border-orange-500/30"></div>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </li>
          </ul>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-500/30">
            <p className="text-xs text-orange-200 text-center">
              © {new Date().getFullYear()} Rumah Seho Nusantara
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}