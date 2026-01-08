📂 RUMAH SEHO NUSANTARA - PROJECT DOCUMENTATION
1. Project Overview
Aplikasi web e-commerce sederhana untuk PT. Rumah Seho Nusantara yang berfokus pada pencatatan transaksi penjualan, manajemen produk, dan pembuatan invoice otomatis tanpa payment gateway.

[cite_start]

Tujuan: Digitalisasi pencatatan penjualan yang sebelumnya manual.   

Target Pengguna:

[cite_start]

Admin: Mengelola produk, melihat laporan penjualan, cetak ulang invoice.   

[cite_start]

Customer: Melihat katalog, checkout barang, download invoice PDF.   

[cite_start]

Metode: Waterfall.   

2. Tech Stack (Strict Guidelines)
AI wajib mengikuti versi dan library berikut:

Backend (Node.js)
Framework: Express.js (type: module)

Database: MySQL

ORM: Sequelize (Standard Models & Relations)

Auth: Session-based (express-session, connect-session-sequelize)

Security: argon2 (Hashing), cors

File Upload: express-fileupload (Images stored in public/images)

Language: JavaScript (No TypeScript)

Frontend (Next.js)
Framework: Next.js 16 (App Router)

Language: JavaScript (No TypeScript)

Styling: Tailwind CSS v4 (CSS-first config via @import "tailwindcss"; in globals.css) + DaisyUI.

Data Fetching: Axios (with credentials: true).

State Management: React Context API (CartContext).

PDF Generator: react-to-print.

3. Database Schema (MySQL)
A. Users
uuid (string), name, email, password (hashed), role ('admin' | 'customer'), address, phone.

B. Products
uuid, name, price (int), description, image (filename), url (static path).

C. Sales (Header Transaksi)
uuid, invoice_number (Format: INV/MMYY/XXXX), transaction_date, due_date (H+7), total_price, status, userId.

D. SaleItems (Detail Transaksi)
qty, price_at_purchase (Snapshot harga saat beli), subtotal, saleId, productId.

4. App Structure & Workflow
🌍 Global Flow
Public: Landing Page (/) -> View Catalog (/shop) -> Login Required to Buy.

Auth: Login/Register (/login, /register). Redirects based on role.

🛒 Customer Flow
Browse: User melihat produk di /shop.

Action: Klik "Add to Cart". Jika belum login -> Redirect ke Login.

Cart: Data disimpan di CartContext (LocalStorage persistent).

Checkout:

Hit API POST /checkout.

Backend membuat data Sales & SaleItems.

Return saleId (UUID).

Invoice: Redirect ke /invoice/[uuid]. [cite_start]User download PDF (Layout A4 Standard).   

🛡️ Admin Flow
Dashboard: Akses /dashboard.

Product Management: /dashboard/products (CRUD + Upload Image).

Sales Report: /dashboard/sales (Tabel rekap transaksi).

Reprint: Admin bisa klik transaksi untuk melihat/cetak Invoice Customer.

5. Key Business Logic (Backend)
Transaction (Checkout)
Endpoint: POST /checkout

Wajib menggunakan Sequelize Transaction (t) untuk integritas data.

Loop items dari frontend -> Validasi Product ID -> Ambil harga DB (bukan dari frontend) -> Hitung Subtotal -> Insert Sales -> Bulk Insert SaleItems.

Invoice Number Generator
Format otomatis: INV/ + BulanTahun + UnixTimestamp (Unique).

Data Invoice memuat: Logo Perusahaan, Info Bank (Static), Data Customer, Tabel Barang, Total.