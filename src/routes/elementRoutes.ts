import { Router } from "express";
import {
	getElement,
	searchElements,
	createElement,
	updateElement,
	deleteElement,
} from "../controllers/elementController";

const router = Router();

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements:
 *   get:
 *     summary: Search elements by placeholder type within a page
 *     tags: [Elements]
 *     parameters:
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page
 *       - in: query
 *         name: placeholderType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of the placeholder (e.g., TITLE, BODY)
 *     responses:
 *       200:
 *         description: Elements retrieved successfully
 *       500:
 *         description: Error searching elements
 */
router.get(
	"/api/presentations/:presentationId/pages/:pageId/elements",
	searchElements,
);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements/{elementId}:
 *   get:
 *     summary: Get an element by its ID
 *     tags: [Elements]
 *     parameters:
 *       - in: path
 *         name: elementId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the element
 *     responses:
 *       200:
 *         description: Element retrieved successfully
 *       500:
 *         description: Error retrieving element
 */
router.get(
	"/api/presentations/:presentationId/pages/:pageId/elements/:elementId",
	getElement,
);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements:
 *   post:
 *     summary: Create a new element within a page
 *     tags: [Elements]
 *     requestBody:
 *       description: Element details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placeholderType:
 *                 type: string
 *                 example: "TITLE"
 *     responses:
 *       201:
 *         description: Element created successfully
 *       500:
 *         description: Error creating element
 */
router.post(
	"/api/presentations/:presentationId/pages/:pageId/elements",
	createElement,
);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements/{elementId}:
 *   put:
 *     summary: Update an element by its placeholder
 *     tags: [Elements]
 *     parameters:
 *       - in: path
 *         name: elementId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the element to update
 *     requestBody:
 *       description: Update element details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated text for element"
 *     responses:
 *       200:
 *         description: Element updated successfully
 *       500:
 *         description: Error updating element
 */
router.put(
	"/api/presentations/:presentationId/pages/:pageId/elements/:elementId",
	updateElement,
);

/**
 * @swagger
 * /api/presentations/{presentationId}/pages/{pageId}/elements/{elementId}:
 *   delete:
 *     summary: Delete an element by its ID
 *     tags: [Elements]
 *     parameters:
 *       - in: path
 *         name: elementId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the element to delete
 *     responses:
 *       200:
 *         description: Element deleted successfully
 *       500:
 *         description: Error deleting element
 */
router.delete(
	"/api/presentations/:presentationId/pages/:pageId/elements/:elementId",
	deleteElement,
);

export default router;
