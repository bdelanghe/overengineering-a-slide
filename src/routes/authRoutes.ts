import { Router } from "express";
import { auth, oauthCallback } from "../controllers/authController";

const router = Router();

router.get("/auth", auth);
router.get("/oauth2callback", oauthCallback);

export default router;
