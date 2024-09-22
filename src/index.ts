import { createPresentation } from "./slide";

/**
 * Main function to create a Google Slide presentation.
 */
async function main() {
	try {
		// Create a presentation with a given title
		const presentation = await createPresentation("Overengineering a Slide");
		console.log(
			`Open your presentation: https://docs.google.com/presentation/d/${presentation.presentationId}/edit`,
		);
	} catch (error) {
		console.error("Error creating presentation:", error);
	}
}

main();
