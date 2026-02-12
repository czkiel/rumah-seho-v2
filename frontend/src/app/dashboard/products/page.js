// src/app/dashboard/products/page.js
"use client";

import { useState, useEffect } from "react";
import axios from "../../../lib/axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ====== STATE BARU UNTUK EDIT ======
  const [editId, setEditId] = useState(null); // UUID produk yang sedang diedit
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [editError, setEditError] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  // ===================================

  const getProducts = async () => {
    try {
      setIsFetching(true);
      setError("");
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Gagal memuat data produk");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const loadImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      setFile(image);
      setPreview(URL.createObjectURL(image));
    }
  };

  // ====== FUNGSI LOAD IMAGE UNTUK EDIT ======
  const loadEditImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      setEditFile(image);
      setEditPreview(URL.createObjectURL(image));
    }
  };
  // ==========================================

  const saveProduct = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      setIsLoading(true);
      await axios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setPrice("");
      setDescription("");
      setFile(null);
      setPreview("");
      document.getElementById("modal_add_product").close();
      getProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.response?.data?.msg || "Gagal menyimpan produk");
    } finally {
      setIsLoading(false);
    }
  };

  // ====== FUNGSI BUKA MODAL EDIT (isi form dengan data produk) ======
  const openEditModal = (product) => {
    setEditId(product.uuid);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDescription(product.description || "");
    setEditFile(null);
    setEditPreview(product.url); // Tampilkan gambar lama sebagai preview
    setEditError("");
    document.getElementById("modal_edit_product").showModal();
  };
  // ==================================================================

  // ====== FUNGSI RESET & TUTUP MODAL EDIT ======
  const closeEditModal = () => {
    document.getElementById("modal_edit_product").close();
    setEditId(null);
    setEditName("");
    setEditPrice("");
    setEditDescription("");
    setEditFile(null);
    setEditPreview("");
    setEditError("");
  };
  // ==============================================

  // ====== FUNGSI UPDATE PRODUK ======
  const updateProduct = async (e) => {
    e.preventDefault();
    setEditError("");

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("price", editPrice);
    formData.append("description", editDescription);
    // Hanya append file jika user memilih gambar baru
    if (editFile) {
      formData.append("file", editFile);
    }

    try {
      setIsEditLoading(true);
      await axios.patch(`/products/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      closeEditModal();
      getProducts(); // Refresh data
    } catch (error) {
      console.error("Error updating product:", error);
      setEditError(error.response?.data?.msg || "Gagal mengupdate produk");
    } finally {
      setIsEditLoading(false);
    }
  };
  // ==================================

  const deleteProduct = async (uuid) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      await axios.delete(`/products/${uuid}`);
      getProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Produk
          </h1>
          <p className="text-gray-600">
            Kelola katalog produk Anda ({products.length} produk)
          </p>
        </div>
        <button
          className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-xl shadow-lg"
          onClick={() =>
            document.getElementById("modal_add_product").showModal()
          }>
          <svg
            className="w-5 h-5 mr-2"
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
          Tambah Produk
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
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
            className="input input-bordered w-full pl-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error shadow-lg rounded-xl">
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
          <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
      )}

      {/* Products Grid */}
      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <svg
            className="w-24 h-24 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Coba cari dengan kata kunci lain"
              : "Mulai dengan menambahkan produk pertama Anda"}
          </p>
          {!searchQuery && (
            <button
              className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-xl"
              onClick={() =>
                document.getElementById("modal_add_product").showModal()
              }>
              Tambah Produk Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.uuid}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="relative h-48 bg-gray-100">
                <img
                  src={product.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
                  {product.description || "Tidak ada deskripsi"}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* ====== TOMBOL EDIT YANG SUDAH AKTIF ====== */}
                  <button
                    className="btn btn-sm btn-outline flex-1 rounded-xl"
                    onClick={() => openEditModal(product)}>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  {/* =========================================== */}
                  <button
                    onClick={() => deleteProduct(product.uuid)}
                    className="btn btn-sm btn-error flex-1 rounded-xl text-white">
                    <svg
                      className="w-4 h-4 mr-1"
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
          ))}
        </div>
      )}

      {/* ================ MODAL TAMBAH PRODUK ================ */}
      <dialog id="modal_add_product" className="modal">
        <div className="modal-box max-w-2xl rounded-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            Tambah Produk Baru
          </h3>
          {error && (
            <div className="alert alert-error mb-4 rounded-xl">
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form onSubmit={saveProduct} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Nama Produk</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Gula Aren Granule 1kg"
                className="input input-bordered w-full rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Harga (Rp)</span>
              </label>
              <input
                type="number"
                placeholder="50000"
                className="input input-bordered w-full rounded-xl"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Deskripsi</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full rounded-xl min-h-24"
                placeholder="Deskripsi produk (ukuran, berat, dll)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Foto Produk</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full rounded-xl"
                onChange={loadImage}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Format: JPG, PNG, atau GIF (Maks. 5MB)
                </span>
              </label>
            </div>
            {preview && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-xl shadow-lg border-2 border-orange-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview("");
                      setFile(null);
                    }}
                    className="absolute top-2 right-2 btn btn-sm btn-circle btn-error">
                    ✕
                  </button>
                </div>
              </div>
            )}
            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-outline rounded-xl"
                onClick={() => {
                  document.getElementById("modal_add_product").close();
                  setName("");
                  setPrice("");
                  setDescription("");
                  setFile(null);
                  setPreview("");
                  setError("");
                }}>
                Batal
              </button>
              <button
                type="submit"
                className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-xl"
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Menyimpan...
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Simpan Produk
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* ================ MODAL EDIT PRODUK (BARU) ================ */}
      <dialog id="modal_edit_product" className="modal">
        <div className="modal-box max-w-2xl rounded-2xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeEditModal}>
              ✕
            </button>
          </form>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            Edit Produk
          </h3>
          {editError && (
            <div className="alert alert-error mb-4 rounded-xl">
              <span className="text-sm">{editError}</span>
            </div>
          )}
          <form onSubmit={updateProduct} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Nama Produk</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Gula Aren Granule 1kg"
                className="input input-bordered w-full rounded-xl"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Harga (Rp)</span>
              </label>
              <input
                type="number"
                placeholder="50000"
                className="input input-bordered w-full rounded-xl"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                required
                min="0"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Deskripsi</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full rounded-xl min-h-24"
                placeholder="Deskripsi produk (ukuran, berat, dll)"
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(e.target.value)
                }></textarea>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Foto Produk</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full rounded-xl"
                onChange={loadEditImage}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Kosongkan jika tidak ingin mengganti gambar. Format: JPG, PNG
                  (Maks. 10MB)
                </span>
              </label>
            </div>

            {/* Preview gambar (lama atau baru) */}
            {editPreview && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={editPreview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-xl shadow-lg border-2 border-blue-200"
                  />
                  {editFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditPreview(
                          products.find((p) => p.uuid === editId)?.url || ""
                        );
                        setEditFile(null);
                      }}
                      className="absolute top-2 right-2 btn btn-sm btn-circle btn-error">
                      ✕
                    </button>
                  )}
                  {!editFile && (
                    <span className="absolute bottom-2 left-2 badge badge-info text-xs">
                      Gambar saat ini
                    </span>
                  )}
                  {editFile && (
                    <span className="absolute bottom-2 left-2 badge badge-success text-xs">
                      Gambar baru
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-outline rounded-xl"
                onClick={closeEditModal}>
                Batal
              </button>
              <button
                type="submit"
                className="btn bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none rounded-xl"
                disabled={isEditLoading}>
                {isEditLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Mengupdate...
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Update Produk
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeEditModal}>close</button>
        </form>
      </dialog>
      {/* ========================================================= */}
    </div>
  );
}