// src/app/cart/page.js
"use client";

import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";
import axios from "../../lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Keranjang kosong!");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCheckout = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          qty: item.qty,
        })),
      };

      const response = await axios.post("/checkout", payload);
      clearCart();
      router.push(`/invoice/${response.data.saleId}`);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.msg || "Gagal checkout. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) {
      if (confirm("Hapus produk dari keranjang?")) {
        removeFromCart(item.id);
      }
      return;
    }
    updateQuantity(item.id, newQty);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      <Navbar />

      {/* Header Section */}
      <div className="bg-linear-to-r from-orange-600 to-orange-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Keranjang Belanja
          </h1>
          <p className="text-orange-100">
            {cart.length > 0
              ? `${totalItems} item dalam keranjang Anda`
              : "Kelola produk yang ingin Anda beli"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cart.length === 0 ? (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-20 animate-fade-in-up">
            <div className="mb-6">
              <svg
                className="w-32 h-32 mx-auto text-gray-300"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              Keranjang Anda Kosong
            </h2>
            <p className="text-gray-500 mb-8">
              Mulai belanja dan tambahkan produk ke keranjang Anda
            </p>
            <Link
              href="/shop"
              className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
              <svg
                className="w-5 h-5 mr-2"
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
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {error && (
                <div className="alert alert-error shadow-lg rounded-xl mb-4">
                  <svg
                    className="w-6 h-6 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                  <button
                    onClick={() => setError("")}
                    className="btn btn-sm btn-ghost">
                    ✕
                  </button>
                </div>
              )}

              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="shrink-0">
                      <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                              {item.description}
                            </p>
                          )}
                          <div className="text-xl font-bold text-orange-600">
                            Rp {item.price.toLocaleString("id-ID")}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <div className="flex items-center gap-2 border border-gray-300 rounded-xl overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.qty - 1)
                              }
                              className="btn btn-ghost btn-sm rounded-none px-3 hover:bg-orange-50"
                              disabled={isLoading}>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="px-4 py-2 font-semibold text-gray-900 min-w-12 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.qty + 1)
                              }
                              className="btn btn-ghost btn-sm rounded-none px-3 hover:bg-orange-50"
                              disabled={isLoading}>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">
                              Subtotal
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              Rp{" "}
                              {(item.price * item.qty).toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus ${item.name} dari keranjang?`)) {
                              removeFromCart(item.id);
                            }
                          }}
                          className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={isLoading}>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Item</span>
                    <span className="font-semibold">{totalItems} item</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Jumlah Produk</span>
                    <span className="font-semibold">{cart.length} jenis</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Harga
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn w-full bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-xl py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  disabled={isLoading || cart.length === 0}>
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Checkout Sekarang
                    </>
                  )}
                </button>

                <Link
                  href="/shop"
                  className="btn btn-outline w-full mt-3 rounded-xl">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Lanjutkan Belanja
                </Link>

                <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-orange-600 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">Info Penting</p>
                      <p>
                        Setelah checkout, invoice akan otomatis diterbitkan dan
                        dapat diunduh.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Konfirmasi Checkout
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin memproses pesanan ini? Invoice akan
              otomatis diterbitkan setelah checkout.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Item:</span>
                <span className="font-semibold">{totalItems} item</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Harga:</span>
                <span className="font-bold text-orange-600 text-lg">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline flex-1 rounded-xl">
                Batal
              </button>
              <button
                onClick={confirmCheckout}
                className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none flex-1 rounded-xl">
                Ya, Proses Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
