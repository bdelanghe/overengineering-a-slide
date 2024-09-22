import { createPresentation } from "./slide";
import { getConsentUrl, handleAuthCode } from "./auth"; // Import the consent flow functions

/**
 * Main function to create a Google Slide presentation.
 */
async function main() {
	try {
		// Generate the consent URL and prompt the user to authorize the app
		const consentUrl = await getConsentUrl();
		console.log(`Authorize this app by visiting this URL: ${consentUrl}`);

		// Wait for the user to input the authorization code
		const code = await getUserInput("Enter the authorization code here: ");

		// Handle the authorization code and create a presentation
		await handleAuthCode(code, true); // Pass the authorization code and enable verbose logging
		const presentation = await createPresentation("Overengineering a Slide");

		// Output the presentation URL
		console.log(
			`Open your presentation: https://docs.google.com/presentation/d/${presentation.presentationId}/edit`,
		);
	} catch (error) {
		console.error("Error creating presentation:", error);
	}
}

/**
 * Helper function to get user input from the console.
 * @param {string} prompt The prompt to show the user.
 * @returns {Promise<string>} The user's input.
 */
function getUserInput(prompt: string): Promise<string> {
	return new Promise((resolve) => {
		process.stdout.write(prompt);
		process.stdin.once("data", (data) => {
			resolve(data.toString().trim());
		});
	});
}

main();
