import { OAuth2Client } from "google-auth-library";
import { promises as fs } from "fs";
import * as path from "path";

const SCOPES = [
	"https://www.googleapis.com/auth/presentations",
	"https://www.googleapis.com/auth/drive.file",
];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Get the consent URL for OAuth2.
 */
export async function getConsentUrl(): Promise<string> {
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const { client_id, client_secret, redirect_uris } = JSON.parse(content).web;

	const oauth2Client = new OAuth2Client(
		client_id,
		client_secret,
		redirect_uris[0],
	);

	const consentUrl = oauth2Client.generateAuthUrl({
		access_type: "offline", // Ensure refresh token is returned
		scope: SCOPES,
		prompt: "consent",
	});

	return consentUrl;
}

/**
 * Handle the authorization code received from the OAuth2 callback.
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
		redirect_uris[0],
	);

	const { tokens } = await oauth2Client.getToken(code);
	oauth2Client.setCredentials(tokens);

	await saveCredentials(oauth2Client, verbose);

	return oauth2Client;
}

/**
 * Authorize the client, loading saved credentials from the token file.
 */
export async function authorize(verbose: boolean): Promise<OAuth2Client> {
	const tokenData = await fs.readFile(TOKEN_PATH, "utf-8").catch(() => null);

	if (!tokenData) {
		throw new Error("No saved credentials found. Please authenticate first.");
	}

	const credentials = JSON.parse(tokenData);
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const { client_id, client_secret, redirect_uris } = JSON.parse(content).web;

	const oauth2Client = new OAuth2Client(
		client_id,
		client_secret,
		redirect_uris[0],
	);
	oauth2Client.setCredentials(credentials);

	if (verbose) {
		console.log("Loaded credentials from token file.");
	}

	return oauth2Client;
}

/**
 * Save credentials to the token.json file.
 */
async function saveCredentials(
	client: OAuth2Client,
	verbose: boolean,
): Promise<void> {
	const payload = JSON.stringify(client.credentials);
	await fs.writeFile(TOKEN_PATH, payload);

	if (verbose) {
		console.log("Credentials saved to token.json.");
	}
}
