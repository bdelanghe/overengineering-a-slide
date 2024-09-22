import { Router } from "express";
import { createSlide, getFirstSlide } from "../controllers/slideController";

const router = Router();

/**
 * @swagger
 * /api/presentation:
 *   get:
 *     summary: Create a Google Slide presentation
 *     tags: [Slides]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Title of the presentation (default is 'Untitled Presentation')
 *     responses:
 *       200:
 *         description: Presentation already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Presentation already exists!"
 *                 url:
 *                   type: string
 *                   example: "https://docs.google.com/presentation/d/{presentationId}/edit"
 *       201:
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
 *         description: Error creating or fetching presentation
 */
router.get("/api/presentation", createSlide);

/**
 * @swagger
 * /api/presentation/{presentationId}/first-slide:
 *   get:
 *     summary: Get the elements of the first slide in a presentation
 *     tags: [Slides]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the presentation
 *     responses:
 *       200:
 *         description: First slide elements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "First slide elements retrieved successfully."
 *                 elements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Slide element properties
 *       400:
 *         description: No presentation ID provided
 *       500:
 *         description: Error retrieving first slide elements
 */
router.get("/api/presentation/:presentationId/first-slide", getFirstSlide);

export default router;
