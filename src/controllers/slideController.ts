import { Request, Response } from "express";
import {
	createPresentation,
	getPresentationByTitle,
} from "../services/slideService";

// Create or fetch Google Slide presentation
export const createSlide = async (req: Request, res: Response) => {
	const title = (req.query.title as string) || "Untitled Presentation";

	try {
		// Check if a presentation with the same title exists
		const existingPresentation = await getPresentationByTitle(title);
		if (existingPresentation) {
			return res.status(200).json({
				message: "Presentation already exists!",
				url: `https://docs.google.com/presentation/d/${existingPresentation.presentationId}/edit`,
			});
		}

		// If no presentation with the same title exists, create a new one
		const newPresentation = await createPresentation(title);
		res.status(201).json({
			message: "Presentation created successfully!",
			url: `https://docs.google.com/presentation/d/${newPresentation.presentationId}/edit`,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error processing presentation: ${errMessage}`);
	}
};
