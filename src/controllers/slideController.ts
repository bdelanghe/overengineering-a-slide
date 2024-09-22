import { Request, Response } from "express";
import {
	createPresentation,
	getPresentationByTitle,
	updateFirstSlidePlaceholders,
	getPresentationById,
	getSlideById,
} from "../services/slideService";

// Create or fetch Google Slide presentation and update title/subtitle
export const createSlide = async (req: Request, res: Response) => {
	const title = (req.query.title as string) || "Untitled Presentation";
	const subtitle = (req.query.subtitle as string) || "Subtitle goes here";

	try {
		// Check if a presentation with the same title exists
		const existingPresentation = await getPresentationByTitle(title);
		if (existingPresentation) {
			// Update title and subtitle of the first slide dynamically
			await updateFirstSlidePlaceholders(
				existingPresentation.presentationId!,
				title,
				subtitle,
			);

			return res.status(200).json({
				message: "Presentation already exists and text updated!",
				url: `https://docs.google.com/presentation/d/${existingPresentation.presentationId}/edit`,
				presentation: existingPresentation,
			});
		}

		// Create a new presentation if not found
		const newPresentation = await createPresentation(title);
		await updateFirstSlidePlaceholders(
			newPresentation.presentationId!,
			title,
			subtitle,
		);

		res.status(201).json({
			message: "Presentation created and title updated successfully!",
			url: `https://docs.google.com/presentation/d/${newPresentation.presentationId}/edit`,
			presentation: newPresentation,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error processing presentation: ${errMessage}`);
	}
};

// Fetch the full presentation object by ID
export const getPresentation = async (req: Request, res: Response) => {
	const presentationId = req.params.presentationId;

	try {
		const presentation = await getPresentationById(presentationId);
		res.status(200).json(presentation);
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error fetching presentation: ${errMessage}`);
	}
};

// Fetch the full slide object by ID
export const getSlide = async (req: Request, res: Response) => {
	const presentationId = req.params.presentationId;
	const slideId = req.params.slideId;

	try {
		const slide = await getSlideById(presentationId, slideId);
		res.status(200).json(slide);
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error fetching slide: ${errMessage}`);
	}
};
