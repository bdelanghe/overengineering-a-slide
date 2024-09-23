import { Request, Response } from "express";
import {
	getPageByIdService,
	getPageByIndexService,
	searchPagesService,
	createPageService,
	updatePageByIdService,
	deletePageService,
} from "../services/pageService";

// Get a page (slide) by its ID or index
export const getPageById = async (req: Request, res: Response) => {
	const { presentationId, pageId } = req.params;

	try {
		// If pageId is a number, assume it's an index and use the new service method
		const pageIndex = parseInt(pageId, 10); // Convert pageId to a number
		if (!isNaN(pageIndex)) {
			const page = await getPageByIndexService(presentationId, pageIndex); // Use the index service
			if (page) {
				return res.status(200).json(page);
			} else {
				return res.status(404).json({ message: "Page not found" });
			}
		}

		// If pageId is not a number, use getPageByIdService
		const page = await getPageByIdService(presentationId, pageId);
		if (page) {
			return res.status(200).json(page);
		} else {
			return res.status(404).json({ message: "Page not found" });
		}
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error retrieving page: ${errMessage}` });
	}
};

// Search pages (slides) by index or retrieve all pages
export const searchPages = async (req: Request, res: Response) => {
	const { presentationId } = req.params;
	const { index, layoutObjectId, masterObjectId, pageType } = req.query;

	try {
		// Check if presentationId exists
		if (!presentationId) {
			return res
				.status(400)
				.json({ message: "Missing required parameters: presentationId" });
		}

		// If an index is provided, retrieve the specific page by index
		if (index !== undefined) {
			const pageIndex = parseInt(index as string, 10); // Ensure index is parsed as a number
			if (isNaN(pageIndex)) {
				return res
					.status(400)
					.json({ message: "Index must be a valid number" });
			}

			const page = await getPageByIndexService(presentationId, pageIndex); // Use the index service
			if (!page) {
				return res.status(404).json({ message: "Page not found" });
			}
			return res.status(200).json(page);
		}

		// If no index is provided, filter pages by layoutObjectId, masterObjectId, and pageType
		const pages = await searchPagesService(
			presentationId,
			layoutObjectId as string | undefined,
			masterObjectId as string | undefined,
			(pageType as string) || "SLIDE", // Default to 'SLIDE' if pageType is not provided
		);

		return res.status(200).json(pages);
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error retrieving pages: ${errMessage}` });
	}
};

// Create a new page (slide) in the presentation
export const createPage = async (req: Request, res: Response) => {
	const { presentationId } = req.params;
	const { title, index, predefined_layout } = req.body; // Accept predefined_layout

	try {
		// Pass the predefined_layout to the service if provided
		const newPage = await createPageService(
			presentationId,
			title,
			index,
			predefined_layout,
		);
		return res.status(201).json({
			message: "Page created successfully",
			page: newPage,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error creating page: ${errMessage}` });
	}
};

// Update a page (slide) by ID
export const updatePageById = async (req: Request, res: Response) => {
	const { presentationId, pageId } = req.params;
	const { title } = req.body;

	try {
		const updatedPage = await updatePageByIdService(
			presentationId,
			pageId,
			title,
		);
		return res.status(200).json({
			message: "Page updated successfully",
			page: updatedPage,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error updating page: ${errMessage}` });
	}
};

// Delete a page (slide) by ID
export const deletePage = async (req: Request, res: Response) => {
	const { presentationId, pageId } = req.params;

	try {
		await deletePageService(presentationId, pageId);
		return res.status(200).json({ message: "Page deleted successfully" });
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error deleting page: ${errMessage}` });
	}
};
