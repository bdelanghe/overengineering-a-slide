import { Request, Response } from "express";
import {
	createPresentation as createPresentationService,
	getPresentationById,
	searchPresentationsByTitle,
	updatePresentationTitle,
	deletePresentationById,
} from "../services/presentationService";

// Get a presentation by its ID
export const getPresentation = async (req: Request, res: Response) => {
	const { presentationId } = req.params;

	try {
		const presentation = await getPresentationById(presentationId);
		if (!presentation) {
			return res.status(404).json({ message: "Presentation not found" });
		}
		res.status(200).json(presentation);
	} catch (error) {
		res.status(500).json({ message: "Error retrieving presentation", error });
	}
};

// Search for presentations by title
export const searchPresentations = async (req: Request, res: Response) => {
	const { title } = req.query;

	try {
		const presentations = await searchPresentationsByTitle(title as string);
		res.status(200).json(presentations);
	} catch (error) {
		res.status(500).json({ message: "Error searching presentations", error });
	}
};

// Create a new presentation
export const createPresentation = async (req: Request, res: Response) => {
	const { title } = req.body;

	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}

	try {
		const presentation = await createPresentationService(title);
		res.status(201).json(presentation);
	} catch (error) {
		res.status(500).json({ message: "Error creating presentation", error });
	}
};

// Update a presentation by its title
export const updatePresentation = async (req: Request, res: Response) => {
	const { presentationId } = req.params;
	const { title } = req.body;

	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}

	try {
		const updatedPresentation = await updatePresentationTitle(
			presentationId,
			title,
		);
		if (!updatedPresentation) {
			return res.status(404).json({ message: "Presentation not found" });
		}
		res.status(200).json({
			message: "Presentation updated successfully",
			presentation: updatedPresentation,
		});
	} catch (error) {
		res.status(500).json({ message: "Error updating presentation", error });
	}
};

// Delete a presentation by its ID
export const deletePresentation = async (req: Request, res: Response) => {
	const { presentationId } = req.params;

	try {
		const deleted = await deletePresentationById(presentationId);
		if (!deleted) {
			return res.status(404).json({ message: "Presentation not found" });
		}
		res.status(200).json({ message: "Presentation deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting presentation", error });
	}
};
