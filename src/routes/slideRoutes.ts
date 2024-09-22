import { Router } from "express";
import { createSlide } from "../controllers/slideController";

const router = Router();

router.get("/create-presentation", createSlide);

export default router;
