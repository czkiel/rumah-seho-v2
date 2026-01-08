// src/context/CartContext.js
"use client";

import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 1. LOAD DATA: Ambil dari LocalStorage saat pertama kali buka
  useEffect(() => {
    const savedCart = localStorage.getItem("rumahseho_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2. SAVE DATA: Simpan ke LocalStorage setiap kali cart berubah
  useEffect(() => {
    // Kita cek length > 0 agar tidak menimpa data dgn array kosong saat mounting
    // Tapi untuk kasus add/remove manual, kita handle di fungsinya saja biar aman
    localStorage.setItem("rumahseho_cart", JSON.stringify(cart));
  }, [cart]);

  // Fungsi Tambah
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        newCart = [...prevCart, { ...product, qty: 1 }];
      }
      return newCart;
    });
  };

  // Fungsi Hapus
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Fungsi Update Quantity
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  // Fungsi Bersihkan (Setelah checkout)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("rumahseho_cart"); // Hapus dari storage juga
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);