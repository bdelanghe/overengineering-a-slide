import { Request, Response } from "express";
import {
	getPageElementByIdService,
	createPageElementService,
	updatePageElementByIdService,
	deletePageElementService,
	searchPageElementsService,
} from "../services/pageElementService";

// Get a list of elements or a specific element by index
export const searchPageElements = async (req: Request, res: Response) => {
	const { presentationId, pageId } = req.params;
	const { index } = req.query;

	try {
		if (!presentationId || !pageId) {
			return res.status(400).json({ message: "Missing required parameters" });
		}

		// If index is provided, return the specific element
		if (index !== undefined) {
			const elementIndex = parseInt(index as string, 10); // Convert index to number
			if (isNaN(elementIndex)) {
				return res
					.status(400)
					.json({ message: "Index must be a valid number" });
			}

			// Convert elementIndex to a string if needed by the service
			const element = await getPageElementByIdService(
				presentationId,
				pageId,
				elementIndex.toString(), // Ensure it's passed as a string
			);
			if (!element) {
				return res.status(404).json({ message: "Element not found" });
			}
			return res.status(200).json(element);
		}

		// Otherwise, return all elements on the page
		const elements = await searchPageElementsService(presentationId, pageId);
		return res.status(200).json(elements);
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error retrieving elements: ${errMessage}` });
	}
};

// Get a specific page element by its ID
export const getPageElementById = async (req: Request, res: Response) => {
	const { presentationId, pageId, elementId } = req.params;

	try {
		if (!presentationId || !pageId || !elementId) {
			return res.status(400).json({ message: "Missing required parameters" });
		}

		const element = await getPageElementByIdService(
			presentationId,
			pageId,
			elementId,
		);
		if (!element) {
			return res.status(404).json({ message: "Element not found" });
		}

		return res.status(200).json(element);
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error retrieving element: ${errMessage}` });
	}
};

// Create a new page element
export const createPageElement = async (req: Request, res: Response) => {
	const { presentationId, pageId } = req.params;
	const { type, text } = req.body;

	try {
		const newElement = await createPageElementService(
			presentationId,
			pageId,
			type,
			text,
		);
		return res.status(201).json({
			message: "Element created successfully",
			element: newElement,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error creating element: ${errMessage}` });
	}
};

// Update a page element by its ID
export const updatePageElementById = async (req: Request, res: Response) => {
	const { presentationId, pageId, elementId } = req.params;
	const { text } = req.body;

	try {
		const updatedElement = await updatePageElementByIdService(
			presentationId,
			pageId,
			elementId,
			text,
		);
		return res.status(200).json({
			message: "Element updated successfully",
			element: updatedElement,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error updating element: ${errMessage}` });
	}
};

// Delete a page element by its ID
export const deletePageElement = async (req: Request, res: Response) => {
	const { presentationId, pageId, elementId } = req.params;

	try {
		await deletePageElementService(presentationId, pageId, elementId);
		return res.status(200).json({ message: "Element deleted successfully" });
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error deleting element: ${errMessage}` });
	}
};
