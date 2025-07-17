import express from "express";
import { register, login, guest } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest", guest);

export default router;
 
