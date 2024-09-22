import { Request, Response } from "express";
import { getConsentUrl, handleAuthCode } from "../services/authService";

// Redirect to Google OAuth2 consent page
export const auth = async (_req: Request, res: Response) => {
	try {
		const consentUrl = await getConsentUrl();
		res.redirect(consentUrl);
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error generating consent URL: ${errMessage}`);
	}
};

// Handle OAuth2 callback
export const oauthCallback = async (req: Request, res: Response) => {
	const code = req.query.code as string;

	if (!code) {
		return res.status(400).send("No authorization code provided.");
	}

	try {
		await handleAuthCode(code, true);
		res.send(
			"Authorization successful! You can create a slide by visiting /create-presentation.",
		);
	} catch (error) {
		const errMessage = (error as Error).message;
		res.status(500).send(`Error generating consent URL: ${errMessage}`);
	}
};
