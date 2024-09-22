import { Request, Response } from "express";
import { createPresentation } from "../services/slideService";

// Create Google Slide presentation
export const createSlide = async (req: Request, res: Response) => {
	const title = (req.query.title as string) || "Untitled Presentation";

	try {
		const presentation = await createPresentation(title);
		res.status(200).json({
			message: "Presentation created successfully!",
			url: `https://docs.google.com/presentation/d/${presentation.presentationId}/edit`,
		});
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error creating presentation: ${errMessage}`);
	}
};
