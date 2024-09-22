import express, { Request, Response } from "express";

// Create an instance of an Express app
const app = express();

// This will listen on port 3000 and handle the OAuth2 callback
app.get("/oauth2callback", (req: Request, res: Response) => {
	const authCode = req.query.code as string;

	if (!authCode) {
		res.status(400).send("No authorization code provided.");
		return;
	}

	// Handle the authorization code (you might want to store it or exchange it for tokens)
	console.log("Authorization code received:", authCode);

	// Respond to the user
	res.send("Authorization successful! You can close this window.");
});

// Define the port for the server
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
