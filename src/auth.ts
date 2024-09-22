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
const TOKEN_PATH =
	process.env.TOKEN_PATH || path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH =
	process.env.CREDENTIALS_PATH || path.join(process.cwd(), "credentials.json");

/**
 * Load previously saved credentials from the token file.
 */
export async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
	try {
		console.log("Loading saved credentials from token.json...");
		const content = await fs.readFile(TOKEN_PATH, "utf-8");
		const credentials: Credentials = JSON.parse(content);

		if (!credentials.refresh_token) {
			throw new Error("Missing refresh token in the saved credentials.");
		}

		const client = await loadOAuthClient(credentials);
		await checkAndRefreshToken(client, credentials);
		return client;
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") {
			console.log(
				"No saved credentials found (token.json missing). Requesting new authorization...",
			);
		} else {
			console.error("Error loading saved credentials:", err);
		}
		return null;
	}
}

/**
 * Load OAuth2Client with the given credentials.
 */
async function loadOAuthClient(
	credentials: Credentials,
): Promise<OAuth2Client> {
	console.log("Loading OAuth2 client with credentials...");
	const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
	const { client_id, client_secret, redirect_uris } = JSON.parse(content).web;

	const client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
	client.setCredentials(credentials);
	return client;
}

/**
 * Check if the token is expiring soon, and refresh it if necessary.
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
 * Save credentials to the token.json file.
 */
async function saveCredentials(client: OAuth2Client): Promise<void> {
	console.log("Saving credentials to token.json...");
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
	console.log("Credentials saved successfully.");
}

/**
 * Authorize the client, loading saved credentials or requesting new authorization.
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
		console.log("Authorization successful, credentials:", client.credentials);

		if (client.credentials.refresh_token) {
			console.log("Refresh token received.");
		} else {
			console.warn(
				"No refresh token returned. Reauthorization may be required in the future.",
			);
		}

		await saveCredentials(client);
	} else {
		console.error("Authorization failed, no credentials returned.");
	}

	return client;
}
