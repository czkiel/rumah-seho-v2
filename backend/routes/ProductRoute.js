import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/Products.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/products', getProducts); // Customer boleh lihat tanpa login (opsional) atau login dulu
router.get('/products/:id', getProductById);
router.post('/products', verifyUser, adminOnly, createProduct); // Cuma Admin
router.patch('/products/:id', verifyUser, adminOnly, updateProduct); // Cuma Admin
router.delete('/products/:id', verifyUser, adminOnly, deleteProduct); // Cuma Admin

export default router;