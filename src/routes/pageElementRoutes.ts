import { Router } from "express";
import {
	getPageElementById,
	createPageElement,
	updatePageElementById,
	deletePageElement,
	searchPageElements,
} from "../controllers/pageElementController";

const router = Router({ mergeParams: true }); // Enable merging parent route parameters

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements:
 *   get:
 *     summary: Get a list of elements in the page or get a specific element by index
 *     tags: [PageElements]
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
 *         description: ID of the page to search elements for
 *       - in: query
 *         name: index
 *         schema:
 *           type: number
 *         required: false
 *         description: The index of the element to retrieve (optional)
 *     responses:
 *       200:
 *         description: List of elements or a specific element if index is provided
 *       404:
 *         description: Element not found
 *       500:
 *         description: Error retrieving elements
 */
router.get("/", searchPageElements); // Handles list and search by index

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements/{elementId}:
 *   get:
 *     summary: Get a page element by its ID
 *     tags: [PageElements]
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
 *         description: ID of the page
 *       - in: path
 *         name: elementId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the element to retrieve
 *     responses:
 *       200:
 *         description: Element retrieved successfully
 *       404:
 *         description: Element not found
 *       500:
 *         description: Error retrieving element
 */
router.get("/:elementId", getPageElementById);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements:
 *   post:
 *     summary: Create a new element in the page
 *     tags: [PageElements]
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
 *         description: ID of the page
 *     requestBody:
 *       description: Element details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "TEXT_BOX"
 *               text:
 *                 type: string
 *                 example: "Hello, World!"
 *     responses:
 *       201:
 *         description: Element created successfully
 *       500:
 *         description: Error creating element
 */
router.post("/", createPageElement);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements/{elementId}:
 *   put:
 *     summary: Update an element by ID
 *     tags: [PageElements]
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
 *         description: ID of the page
 *       - in: path
 *         name: elementId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the element to update
 *     requestBody:
 *       description: Element details to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated text"
 *     responses:
 *       200:
 *         description: Element updated successfully
 *       404:
 *         description: Element not found
 *       500:
 *         description: Error updating element
 */
router.put("/:elementId", updatePageElementById);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements/{elementId}:
 *   delete:
 *     summary: Delete an element by its ID
 *     tags: [PageElements]
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
 *         description: ID of the page
 *       - in: path
 *         name: elementId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the element to delete
 *     responses:
 *       200:
 *         description: Element deleted successfully
 *       404:
 *         description: Element not found
 *       500:
 *         description: Error deleting element
 */
router.delete("/:elementId", deletePageElement);

export default router;
