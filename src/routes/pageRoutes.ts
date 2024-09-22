import { Router } from "express";
import {
	getPage,
	createPage,
	updatePage,
	deletePage,
	searchPages,
} from "../controllers/pageController";

const router = Router();

/**
 * @swagger
 * /api/presentations/{presentationId}/pages:
 *   get:
 *     summary: Search pages by index
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation
 *     responses:
 *       200:
 *         description: List of pages
 *       500:
 *         description: Error searching pages
 */
router.get("/api/presentations/:presentationId/pages", searchPages);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}:
 *   get:
 *     summary: Get a page by its ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page
 *     responses:
 *       200:
 *         description: Page retrieved successfully
 *       500:
 *         description: Error retrieving page
 */
router.get("/api/presentations/:presentationId/pages/:pageId", getPage);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages:
 *   post:
 *     summary: Create a new page within a presentation
 *     tags: [Pages]
 *     requestBody:
 *       description: Page details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Page"
 *     responses:
 *       201:
 *         description: Page created successfully
 *       500:
 *         description: Error creating page
 */
router.post("/api/presentations/:presentationId/pages", createPage);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}:
 *   put:
 *     summary: Update a page by its index
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page to update
 *     requestBody:
 *       description: Update page details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Page"
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       500:
 *         description: Error updating page
 */
router.put("/api/presentations/:presentationId/pages/:pageId", updatePage);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}:
 *   delete:
 *     summary: Delete a page by its ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page to delete
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       500:
 *         description: Error deleting page
 */
router.delete("/api/presentations/:presentationId/pages/:pageId", deletePage);

export default router;
