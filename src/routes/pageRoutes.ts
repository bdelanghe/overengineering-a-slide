import { Router } from "express";
import {
	getPageById,
	searchPages,
	createPage,
	updatePageById,
	deletePage,
} from "../controllers/pageController";
import pageElementRoutes from "./pageElementRoutes"; // Import page element routes

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
 *         description: ID of the presentation
 *       - in: query
 *         name: index
 *         schema:
 *           type: number
 *         required: false
 *         description: The index of the page to retrieve (optional)
 *       - in: query
 *         name: layoutObjectId
 *         schema:
 *           type: string
 *         required: false
 *         description: The layoutObjectId to filter pages by (optional)
 *       - in: query
 *         name: masterObjectId
 *         schema:
 *           type: string
 *         required: false
 *         description: The masterObjectId to filter pages by (optional)
 *       - in: query
 *         name: pageType
 *         schema:
 *           type: string
 *           enum: [SLIDE, MASTER, LAYOUT, NOTES]
 *         required: false
 *         description: The inferred page type to filter by (default is SLIDE)
 *     responses:
 *       200:
 *         description: List of pages or a specific page if index is provided
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error retrieving pages
 */
router.get("/", searchPages);

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

router.use("/:pageId/elements", pageElementRoutes); // Nested route for elements under pages

export default router;
