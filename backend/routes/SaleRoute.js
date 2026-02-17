import express from "express";
import { getSales, getSaleById, createSale, createManualSale} from "../controllers/Sales.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Customer bisa Create & Lihat transaksinya sendiri
// Admin bisa Lihat semua transaksi
router.get('/sales', verifyUser, getSales); 
router.get('/sales/:id', verifyUser, getSaleById);
router.post('/checkout', verifyUser, createSale);
router.post('/sales/manual', verifyUser, adminOnly, createManualSale);
export default router;