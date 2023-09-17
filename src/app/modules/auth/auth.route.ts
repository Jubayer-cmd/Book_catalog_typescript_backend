import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

router.post("/auth/signup", authController.createUser);
router.post("/auth/signin", authController.loginUser);
router.post("/auth/refresh-token", authController.getRefreshToken);

export const authRoutes = router;
