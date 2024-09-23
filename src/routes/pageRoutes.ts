import { Router } from "express";
import {
	getPageById,
	searchPages,
	createPage,
	updatePageById,
	deletePage,
} from "../controllers/pageController";

const router = Router({ mergeParams: true }); // Enable merging parent route parameters

/**
 * @swagger
 * /api/presentations/{presentationId}/pages:
 *   get:
 *     summary: Get a list of pages (slides) in the presentation or get a specific page by index
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
 *         description: The index of the page to retrieve (optional)
 *     responses:
 *       200:
 *         description: List of pages or a single page if index is provided
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error retrieving pages
 */
router.get("/", searchPages); // Handles list and search by index

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
router.get("/:pageId", getPageById);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages:
 *   post:
 *     summary: Create a new page (slide) in the presentation
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: presentationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the presentation
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
 *                 example: "Slide Title"
 *               index:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Page created successfully
 *       500:
 *         description: Error creating page
 */
router.post("/", createPage);

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
router.put("/:pageId", updatePageById);

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
router.delete("/:pageId", deletePage);

export default router;
