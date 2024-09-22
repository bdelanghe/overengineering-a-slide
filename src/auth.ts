import { promises as fs } from "fs";
import * as path from "path";
import { OAuth2Client, Credentials } from "google-auth-library";
import { authenticate } from "@google-cloud/local-auth";

// Define constants
const SCOPES = [
	"https://www.googleapis.com/auth/presentations",
	"https://www.googleapis.com/auth/drive.file",
];
const TOKEN_EXPIRY_THRESHOLD_MS = 300000; // 5 minutes
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client | null>}
 */
export async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
	try {
		const content = await fs.readFile(TOKEN_PATH, "utf-8");
		const credentials: Credentials = JSON.parse(content);

		if (!credentials.refresh_token) {
			throw new Error("Missing refresh token in the saved credentials.");
		}

		const client = await loadOAuthClient(credentials);

		// Check if the token is expiring soon and refresh if necessary
		await checkAndRefreshToken(client, credentials);

		return client;
	} catch (err) {
		if (err instanceof Error) {
			console.log("Error loading saved credentials:", err.message);
		} else {
			console.log("Unknown error loading saved credentials:", err);
		}
		return null;
	}
}

/**
 * Loads the OAuth2Client with given credentials.
 *
 * @param {Credentials} credentials
 * @return {OAuth2Client}
 */
export async function loadOAuthClient(
	credentials: Credentials,
): Promise<OAuth2Client> {
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const key = JSON.parse(content);

	const { client_id, client_secret, redirect_uris } = key.web;
	const client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
	client.setCredentials(credentials);

	return client;
}

/**
 * Checks if the token is expiring soon and refreshes it if necessary.
 *
 * @param {OAuth2Client} client - The OAuth2 client.
 * @param {Credentials} credentials - The credentials containing the expiry date.
 */
async function checkAndRefreshToken(
	client: OAuth2Client,
	credentials: Credentials,
): Promise<void> {
	const currentTime = Date.now();
	const tokenExpiry = credentials.expiry_date;

	if (tokenExpiry && currentTime >= tokenExpiry - TOKEN_EXPIRY_THRESHOLD_MS) {
		console.log("Token is expiring soon, refreshing...");
		const newTokens = await client.refreshAccessToken(); // Refresh the token
		client.setCredentials(newTokens.credentials);
		await saveCredentials(client); // Save the updated token
	}
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
export async function saveCredentials(client: OAuth2Client): Promise<void> {
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const keys = JSON.parse(content);

	const payload = JSON.stringify({
		type: "authorized_user",
		client_id: keys.web.client_id,
		client_secret: keys.web.client_secret,
		refresh_token: client.credentials?.refresh_token, // Ensure refresh_token is saved
		access_token: client.credentials?.access_token,
		expiry_date: client.credentials?.expiry_date, // Save the expiry date
	});

	await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request authorization to call APIs.
 *
 * @return {Promise<OAuth2Client>}
 */
export async function authorize(): Promise<OAuth2Client> {
	let client = await loadSavedCredentialsIfExist();

	if (client) {
		console.log("Using saved credentials...");
		return client;
	}

	console.log("Requesting new authorization...");
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	});

	if (client.credentials) {
		await saveCredentials(client);
	}

	return client;
}
