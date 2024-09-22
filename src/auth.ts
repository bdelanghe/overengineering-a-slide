import { promises as fs } from "fs";
import * as path from "path";
import { OAuth2Client, Credentials } from "google-auth-library";

// Define constants
const SCOPES = [
	"https://www.googleapis.com/auth/presentations",
	"https://www.googleapis.com/auth/drive.file",
];
const TOKEN_EXPIRY_THRESHOLD_MS = 300000; // 5 minutes
const TOKEN_PATH =
	process.env.TOKEN_PATH || path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH =
	process.env.CREDENTIALS_PATH || path.join(process.cwd(), "credentials.json");
const REDIRECT_URI = "http://localhost:3000/oauth2callback"; // Replace with your redirect URI

/**
 * Logs messages if verbose mode is enabled.
 */
function log(message: string, verbose: boolean) {
	if (verbose) {
		console.log(message);
	}
}

/**
 * Load OAuth2Client with the given credentials.
 */
async function loadOAuthClient(
	credentials: Credentials,
	verbose: boolean,
): Promise<OAuth2Client> {
	log("Loading OAuth2 client with credentials...", verbose);
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const { client_id, client_secret, redirect_uris } = JSON.parse(content).web;

	const client = new OAuth2Client(
		client_id,
		client_secret,
		redirect_uris[0] || REDIRECT_URI,
	);
	client.setCredentials(credentials);
	return client;
}

/**
 * Generate consent URL for manual authorization with offline access
 */
export async function getConsentUrl(): Promise<string> {
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const { client_id, client_secret, redirect_uris } = JSON.parse(content).web;

	const oauth2Client = new OAuth2Client(
		client_id,
		client_secret,
		redirect_uris[0] || REDIRECT_URI,
	);

	const consentUrl = oauth2Client.generateAuthUrl({
		access_type: "offline", // This ensures a refresh token is returned
		scope: SCOPES,
		prompt: "consent", // Ensures the user is prompted for consent every time
	});

	return consentUrl;
}

/**
 * Exchange authorization code for access and refresh tokens.
 */
export async function handleAuthCode(
	code: string,
	verbose: boolean,
): Promise<OAuth2Client> {
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const { client_id, client_secret, redirect_uris } = JSON.parse(content).web;

	const oauth2Client = new OAuth2Client(
		client_id,
		client_secret,
		redirect_uris[0] || REDIRECT_URI,
	);

	// Exchange code for tokens
	const { tokens } = await oauth2Client.getToken(code);
	oauth2Client.setCredentials(tokens);

	// Save the credentials (including refresh token if available)
	await saveCredentials(oauth2Client, verbose);

	return oauth2Client;
}

/**
 * Check if the token is expiring soon, and refresh it if necessary.
 */
async function checkAndRefreshToken(
	client: OAuth2Client,
	credentials: Credentials,
	verbose: boolean,
): Promise<void> {
	const currentTime = Date.now();
	const tokenExpiry = credentials.expiry_date;

	if (tokenExpiry && currentTime >= tokenExpiry - TOKEN_EXPIRY_THRESHOLD_MS) {
		log("Token is expiring soon, refreshing...", verbose);
		try {
			const newTokens = await client.refreshAccessToken(); // Refresh the token
			client.setCredentials(newTokens.credentials);
			await saveCredentials(client, verbose); // Save the updated token
		} catch (error) {
			console.error(
				"Error refreshing token, possibly due to deleted permissions:",
				error,
			);
		}
	}
}

/**
 * Save credentials to the token.json file.
 */
async function saveCredentials(
	client: OAuth2Client,
	verbose: boolean,
): Promise<void> {
	log("Saving credentials to token.json...", verbose);
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const { client_id, client_secret } = JSON.parse(content).web;

	const payload = JSON.stringify({
		type: "authorized_user",
		client_id,
		client_secret,
		refresh_token: client.credentials?.refresh_token || "", // Save refresh token if available
		access_token: client.credentials?.access_token,
		expiry_date: client.credentials?.expiry_date,
	});

	await fs.writeFile(TOKEN_PATH, payload);
	log("Credentials saved successfully.", verbose);
}

/**
 * Authorize the client, loading saved credentials or requesting new authorization.
 */
export async function authorize(verbose = true): Promise<OAuth2Client> {
	try {
		// Check if token already exists
		const credentials = JSON.parse(
			await fs.readFile(TOKEN_PATH, "utf-8"),
		) as Credentials;

		// Load OAuth client using existing credentials
		const client = await loadOAuthClient(credentials, verbose);

		// Refresh the token if necessary
		await checkAndRefreshToken(client, credentials, verbose);

		return client;
	} catch (err) {
		// If no token found, ask for new authorization
		console.log("No saved credentials found, requesting new authorization...");
		throw new Error("Authorization required. Please visit the consent URL.");
	}
}
