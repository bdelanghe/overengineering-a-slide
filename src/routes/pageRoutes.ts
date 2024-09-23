import { Router } from "express";
import {
	getPageById,
	searchPages,
	createPage,
	updatePageById,
	deletePage,
} from "../controllers/pageController"; // You will create these in your controller

const router = Router();

/**
 * @swagger
 * /api/presentations/{presentationId}/pages:
 *   get:
 *     summary: Search pages (slides) within a presentation by index
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation to search pages for
 *       - in: query
 *         name: index
 *         schema:
 *           type: number
 *         required: false
 *         description: Search for pages by index within the presentation
 *     responses:
 *       200:
 *         description: List of pages
 *       500:
 *         description: Error searching pages
 */
router.get("/:presentationId/pages", searchPages);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}:
 *   get:
 *     summary: Get a page (slide) by its ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page (slide) to retrieve
 *     responses:
 *       200:
 *         description: Page retrieved successfully
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error retrieving page
 */
router.get("/:presentationId/pages/:pageId", getPageById);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages:
 *   post:
 *     summary: Create a new page (slide) in the presentation
 *     tags: [Pages]
 *     requestBody:
 *       description: Page details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: number
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Slide Title"
 *     responses:
 *       201:
 *         description: Page created successfully
 *       500:
 *         description: Error creating page
 */
router.post("/:presentationId/pages", createPage);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}:
 *   put:
 *     summary: Update a page (slide) by ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page (slide) to update
 *     requestBody:
 *       description: Page details to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Slide Title"
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error updating page
 */
router.put("/:presentationId/pages/:pageId", updatePageById);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}:
 *   delete:
 *     summary: Delete a page (slide) by its ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page (slide) to delete
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error deleting page
 */
router.delete("/:presentationId/pages/:pageId", deletePage);

export default router;
