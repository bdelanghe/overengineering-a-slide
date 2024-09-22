import { Router } from "express";
import { createSlide } from "../controllers/slideController";

const router = Router();

/**
 * @swagger
 * /create-presentation:
 *   get:
 *     summary: Create a Google Slide presentation
 *     tags: [Slides]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Title of the presentation (default is "Untitled Presentation")
 *     responses:
 *       200:
 *         description: Presentation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Presentation created successfully!"
 *                 url:
 *                   type: string
 *                   example: "https://docs.google.com/presentation/d/{presentationId}/edit"
 *       500:
 *         description: Error creating presentation
 */
router.get("/create-presentation", createSlide);

export default router;
