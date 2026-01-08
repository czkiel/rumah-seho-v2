// src/app/shop/page.js
"use client";

import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart, cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    getProducts();
    checkAuth();
  }, []);

  useEffect(() => {
    // Filter products berdasarkan search query
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      await axios.get("/me");
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Check if product already in cart
    const existingItem = cart.find((item) => item.id === product.id);
    addToCart(product);

    // Show toast notification
    setToastMessage(
      existingItem
        ? `${product.name} ditambahkan lagi ke keranjang`
        : `${product.name} ditambahkan ke keranjang`
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      {/* Navbar */}
      {isLoggedIn ? (
        <Navbar />
      ) : (
        <nav className="navbar bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100 sticky top-0 z-50 px-4 lg:px-10">
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Rumah Seho Logo"
                className="h-10 w-auto group-hover:scale-110 transition-transform"
              />
              <span className="text-xl font-bold text-orange-900">
                Rumah Seho Nusantara
              </span>
            </Link>
          </div>
          <div className="flex-none">
            <Link
              href="/login"
              className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-full px-6 shadow-lg hover:shadow-xl transition-all">
              Masuk / Daftar
            </Link>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-600 to-orange-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Katalog Produk Premium
          </h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Temukan gula aren terbaik dengan kualitas premium dari Tomohon,
            Sulawesi Utara
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
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
              placeholder="Cari produk..."
              className="input input-bordered w-full pl-12 pr-4 py-3 rounded-full bg-white shadow-lg border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="card bg-white shadow-lg rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="card-body p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Coba cari dengan kata kunci lain"
                : "Produk akan segera tersedia"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-outline rounded-full">
                Hapus Pencarian
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Menampilkan {filteredProducts.length} dari {products.length}{" "}
              produk
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.uuid}
                  className="card bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <figure className="relative h-56 overflow-hidden group">
                    <img
                      src={product.url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      {isInCart(product.id) && (
                        <div className="badge badge-success gap-2 shadow-lg">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Di Keranjang
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </figure>
                  <div className="card-body p-5">
                    <h2 className="card-title text-lg mb-2 line-clamp-1">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-10">
                      {product.description ||
                        "Produk premium berkualitas tinggi"}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          Rp {product.price.toLocaleString("id-ID")}
                        </div>
                        <div className="text-xs text-gray-500">per unit</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`btn w-full rounded-xl font-semibold transition-all duration-200 ${
                        isInCart(product.id)
                          ? "btn-outline btn-success"
                          : "bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none"
                      }`}>
                      {isLoggedIn ? (
                        <>
                          {isInCart(product.id) ? (
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Tambah Lagi
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
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              Tambah ke Keranjang
                            </>
                          )}
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Login untuk Beli
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="alert alert-success shadow-lg rounded-xl bg-white border-2 border-green-500">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-800 font-medium">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
