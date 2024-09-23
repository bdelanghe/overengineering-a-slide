import { Request, Response } from "express";
import {
	getPageByIdService,
	searchPagesService,
	createPageService,
	updatePageByIdService,
	deletePageService,
} from "../services/pageService"; // Assume you'll have corresponding services for these methods

// Get a page (slide) by its ID
export const getPageById = async (req: Request, res: Response) => {
	const { presentationId, pageId } = req.params;

	try {
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

// Search pages (slides) by index or placeholder
export const searchPages = async (req: Request, res: Response) => {
	const { presentationId } = req.params;
	const { index } = req.query;

	try {
		const pages = await searchPagesService(presentationId, Number(index));
		return res.status(200).json(pages);
	} catch (error) {
		const errMessage = (error as Error).message;
		return res
			.status(500)
			.json({ message: `Error searching pages: ${errMessage}` });
	}
};

// Create a new page (slide) in the presentation
export const createPage = async (req: Request, res: Response) => {
	const { presentationId } = req.params;
	const { title, index } = req.body;

	try {
		const newPage = await createPageService(presentationId, title, index);
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
