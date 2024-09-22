import { Router } from "express";
import {
	createSlide,
	getPresentation,
	getSlide,
} from "../controllers/slideController";

const router = Router();

/**
 * @swagger
 * /api/presentation:
 *   get:
 *     summary: Create or update a Google Slide presentation
 *     tags: [Slides]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Title of the presentation (default is 'Untitled Presentation')
 *       - in: query
 *         name: subtitle
 *         schema:
 *           type: string
 *         required: false
 *         description: Subtitle of the presentation (default is 'Subtitle goes here')
 *     responses:
 *       200:
 *         description: Presentation created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Presentation created and title updated successfully!"
 *                 url:
 *                   type: string
 *                   example: "https://docs.google.com/presentation/d/{presentationId}/edit"
 *                 presentation:
 *                   type: object
 *                   description: Full presentation object
 *       500:
 *         description: Error creating or updating presentation
 */
router.get("/api/presentation", createSlide);

/**
 * @swagger
 * /api/presentation/{presentationId}:
 *   get:
 *     summary: Get a full presentation by its ID
 *     tags: [Slides]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation to retrieve
 *     responses:
 *       200:
 *         description: Presentation retrieved successfully
 *       500:
 *         description: Error retrieving presentation
 */
router.get("/api/presentation/:presentationId", getPresentation);

/**
 * @swagger
 * /api/presentation/{presentationId}/slide/{slideId}:
 *   get:
 *     summary: Get a single slide by its ID
 *     tags: [Slides]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation
 *       - in: path
 *         name: slideId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the slide to retrieve
 *     responses:
 *       200:
 *         description: Slide retrieved successfully
 *       500:
 *         description: Error retrieving slide
 */
router.get("/api/presentation/:presentationId/slide/:slideId", getSlide);

export default router;
