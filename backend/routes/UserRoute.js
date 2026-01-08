import express from "express";
import { getUsers, Register, Login, Me, Logout } from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers); // Hanya admin yg bisa lihat list user
router.get('/me', Me);
router.post('/users', Register); // Register customer
router.post('/login', Login);
router.delete('/logout', Logout);

export default router;