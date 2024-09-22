import { Request, Response } from "express";
import {
	createOrUpdatePresentation,
	getFirstSlideElements,
} from "../services/slideService";

// Create or fetch Google Slide presentation
export const createSlide = async (req: Request, res: Response) => {
	const title = (req.query.title as string) || "Untitled Presentation";

	try {
		// Use the combined createOrUpdatePresentation service to either create or return the existing presentation
		const presentation = await createOrUpdatePresentation(title);

		res.status(201).json({
			message: "Presentation created or updated successfully!",
			url: `https://docs.google.com/presentation/d/${presentation.presentationId}/edit`,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error processing presentation: ${errMessage}`);
	}
};

// Controller method to return the first slide's elements
export const getFirstSlide = async (req: Request, res: Response) => {
	const presentationId = req.params.presentationId;

	if (!presentationId) {
		return res.status(400).send("No presentation ID provided.");
	}

	try {
		// Get the elements of the first slide
		const elements = await getFirstSlideElements(presentationId);
		if (!elements) {
			return res.status(404).send("No elements found on the first slide.");
		}

		// Return the elements as a JSON response
		res.status(200).json({
			message: "First slide elements retrieved successfully.",
			elements,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		res
			.status(500)
			.send(`Error retrieving first slide elements: ${errMessage}`);
	}
};
