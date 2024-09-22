import { Router } from "express";
import {
	getPresentation,
	createPresentation,
	updatePresentation,
	deletePresentation,
	searchPresentations,
} from "../controllers/presentationController";

const router = Router();

/**
 * @swagger
 * /api/presentations:
 *   get:
 *     summary: Search presentations by title
 *     tags: [Presentations]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Search presentations by title
 *     responses:
 *       200:
 *         description: List of presentations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *       500:
 *         description: Error searching presentations
 */
router.get("/api/presentations", searchPresentations);

/**
 * @swagger
 * /api/presentations/{presentationId}:
 *   get:
 *     summary: Get a presentation by its ID
 *     tags: [Presentations]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation
 *     responses:
 *       200:
 *         description: Presentation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Presentation not found
 *       500:
 *         description: Error retrieving presentation
 */
router.get("/api/presentations/:presentationId", getPresentation);

/**
 * @swagger
 * /api/presentations:
 *   post:
 *     summary: Create a new presentation
 *     tags: [Presentations]
 *     requestBody:
 *       description: Presentation details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Presentation"
 *     responses:
 *       201:
 *         description: Presentation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *       400:
 *         description: Invalid request, title is missing
 *       500:
 *         description: Error creating presentation
 */
router.post("/api/presentations", createPresentation);

/**
 * @swagger
 * /api/presentations/{presentationId}:
 *   put:
 *     summary: Update a presentation by title
 *     tags: [Presentations]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation to update
 *     requestBody:
 *       description: Update presentation details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Presentation"
 *     responses:
 *       200:
 *         description: Presentation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Presentation not found
 *       500:
 *         description: Error updating presentation
 */
router.put("/api/presentations/:presentationId", updatePresentation);

/**
 * @swagger
 * /api/presentations/{presentationId}:
 *   delete:
 *     summary: Delete a presentation by its ID
 *     tags: [Presentations]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation to delete
 *     responses:
 *       200:
 *         description: Presentation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Presentation deleted successfully"
 *       404:
 *         description: Presentation not found
 *       500:
 *         description: Error deleting presentation
 */
router.delete("/api/presentations/:presentationId", deletePresentation);

export default router;
