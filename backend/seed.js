// backend/seed.js
import User from "./models/UserModel.js";
import db from "./config/database.js";
import argon2 from "argon2";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    try {
        // 1. Pastikan koneksi dan tabel ada
        await db.authenticate();
        console.log('Database Connected...');
        
        // Opsional: Hapus user lama biar bersih (hati-hati pakai ini kalau data sudah banyak)
        // await User.destroy({ where: {}, truncate: true });

        // 2. Buat Password Hash
        const password = "123"; // Password Admin
        const hashPassword = await argon2.hash(password);

        // 3. Insert Data Admin
        await User.create({
            name: "Super Admin",
            email: "admin@rumahseho.com",
            password: hashPassword,
            role: "admin", // <--- INI KUNCINYA
            address: "Kantor Pusat Rumah Seho",
            phone: "081234567890"
        });

        console.log("✅ Admin Seed Created Successfully!");
        console.log("Email: admin@rumahseho.com");
        console.log("Pass: 123");

    } catch (error) {
        console.error("❌ Failed to create seed:", error.message);
    } finally {
        // Tutup koneksi script selesai
        process.exit();
    }
})();