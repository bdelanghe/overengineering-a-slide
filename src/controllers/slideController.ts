import { Request, Response } from "express";
import { createPresentation } from "../services/slideService";

// Route to create a Google Slide presentation
export const createSlide = async (req: Request, res: Response) => {
	const title = (req.query.title as string) || "Untitled Presentation";

	try {
		const presentation = await createPresentation(title);
		const presentationUrl = `https://docs.google.com/presentation/d/${presentation.presentationId}/edit`;
		res.send(
			`Presentation created successfully! Open your presentation: <a href="${presentationUrl}">${presentationUrl}</a>`,
		);
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error generating consent URL: ${errMessage}`);
	}
};
