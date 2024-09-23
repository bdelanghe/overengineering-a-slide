import { Router } from "express";
import {
	getPresentation,
	createPresentation,
	updatePresentationById,
	upsertPresentation,
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
 *         description: Search for presentations by title
 *     responses:
 *       200:
 *         description: List of presentations
 *       500:
 *         description: Error searching presentations
 */
router.get("/", searchPresentations);

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
 *         description: ID of the presentation to retrieve
 *     responses:
 *       200:
 *         description: Presentation retrieved successfully
 *       404:
 *         description: Presentation not found
 *       500:
 *         description: Error retrieving presentation
 */
router.get("/:presentationId", getPresentation);

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
 *       500:
 *         description: Error creating presentation
 */
router.post("/", createPresentation);

/**
 * @swagger
 * /api/presentations:
 *   put:
 *     summary: Upsert a presentation by title
 *     tags: [Presentations]
 *     requestBody:
 *       description: Presentation details to upsert
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Existing Presentation"
 *               newTitle:
 *                 type: string
 *                 example: "Updated Presentation Title"
 *     responses:
 *       200:
 *         description: Presentation upserted successfully
 *       500:
 *         description: Error upserting presentation
 */
router.put("/", upsertPresentation);

/**
 * @swagger
 * /api/presentations/{presentationId}:
 *   put:
 *     summary: Update a presentation by ID
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
 *       404:
 *         description: Presentation not found
 *       500:
 *         description: Error updating presentation
 */
router.put("/:presentationId", updatePresentationById);

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
 *       404:
 *         description: Presentation not found
 *       500:
 *         description: Error deleting presentation
 */
router.delete("/:presentationId", deletePresentation);

export default router;
