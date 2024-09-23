import { Request, Response } from "express";
import {
	getPresentationById,
	createNewPresentation,
	updatePresentation,
	deletePresentationById,
	searchPresentationsByTitle,
	upsertPresentationByTitle,
} from "../services/presentationService";

/**
 * Get a presentation by its ID
 */
export const getPresentation = async (req: Request, res: Response) => {
	const { presentationId } = req.params;

	try {
		const presentation = await getPresentationById(presentationId);
		if (!presentation) {
			return res.status(404).json({ message: "Presentation not found" });
		}
		return res.status(200).json(presentation);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error retrieving presentation", error });
	}
};

/**
 * Create a new presentation
 */
export const createPresentation = async (req: Request, res: Response) => {
	const { title } = req.body;

	try {
		const newPresentation = await createNewPresentation(title);
		return res.status(201).json(newPresentation);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error creating presentation", error });
	}
};

/**
 * Update a presentation by ID
 */
export const updatePresentationById = async (req: Request, res: Response) => {
	const { presentationId } = req.params;
	const { title } = req.body;

	try {
		const updatedPresentation = await updatePresentation(presentationId, title);
		if (!updatedPresentation) {
			return res.status(404).json({ message: "Presentation not found" });
		}
		return res.status(200).json(updatedPresentation);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error updating presentation", error });
	}
};

/**
 * Upsert a presentation by title
 */
export const upsertPresentation = async (req: Request, res: Response) => {
	const { title, newTitle } = req.body;

	try {
		const upsertedPresentation = await upsertPresentationByTitle(
			title,
			newTitle,
		);
		return res.status(200).json(upsertedPresentation);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error upserting presentation", error });
	}
};

/**
 * Delete a presentation by ID
 */
export const deletePresentation = async (req: Request, res: Response) => {
	const { presentationId } = req.params;

	try {
		const deleted = await deletePresentationById(presentationId);
		if (!deleted) {
			return res.status(404).json({ message: "Presentation not found" });
		}
		return res
			.status(200)
			.json({ message: "Presentation deleted successfully" });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error deleting presentation", error });
	}
};

/**
 * Search presentations by title
 */
export const searchPresentations = async (req: Request, res: Response) => {
	const { title } = req.query;

	try {
		const presentations = await searchPresentationsByTitle(title as string);
		return res.status(200).json(presentations);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error searching presentations", error });
	}
};
