// src/components/Navbar.js
"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import axios from "../lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { cart, totalPrice } = useCart();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await axios.delete("/logout");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="navbar bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100 sticky top-0 z-50 px-4 lg:px-10 transition-all duration-300">
      <div className="flex-1">
        <Link
          href="/shop"
          className="flex items-center gap-3 group transition-all duration-300">
          <img
            src="/logo.png"
            alt="Rumah Seho Logo"
            className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-orange-900 tracking-wide group-hover:text-orange-700 transition-colors">
              Rumah Seho Nusantara
            </span>
            <span className="text-xs text-gray-500 hidden sm:block">
              Gula Aren Premium
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-none gap-3 lg:gap-4">
        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/shop"
            className="btn btn-ghost btn-sm text-orange-900 hover:bg-orange-50 hover:text-orange-700 font-medium transition-all duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Belanja
          </Link>
        </div>

        {/* Cart Button with Dropdown Preview */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle relative hover:bg-orange-50 transition-all duration-200">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="badge badge-sm indicator-item bg-orange-600 text-white border-2 border-white shadow-lg animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </div>
          </label>

          {/* Cart Dropdown Preview */}
          <div
            tabIndex={0}
            className="dropdown-content menu bg-white rounded-2xl shadow-2xl w-80 p-4 mt-2 border border-orange-100">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-900">Keranjang</h3>
              <Link
                href="/cart"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Lihat Semua
              </Link>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-300 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">Keranjang masih kosong</p>
                <Link
                  href="/shop"
                  className="btn btn-sm btn-primary mt-4 rounded-full">
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                  {cart.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={`http://localhost:5000/images/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.qty} × Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-xs text-center text-gray-500 py-2">
                      +{cart.length - 3} item lainnya
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-orange-600">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <Link
                    href="/cart"
                    className="btn btn-primary btn-block rounded-full hover:scale-105 transition-transform">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="btn btn-sm btn-outline btn-error rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 disabled:opacity-50">
          {isLoggingOut ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <span className="hidden sm:inline">Keluar...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
