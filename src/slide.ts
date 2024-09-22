import { google, slides_v1 } from "googleapis";
import { authorize } from "./auth"; // Import the `authorize` function from auth.ts

/**
 * Creates a Google Slide presentation.
 * @param {string} title The presentation title.
 * @returns {Promise<slides_v1.Schema$Presentation>} The created presentation object.
 */
export async function createPresentation(
	title: string,
): Promise<slides_v1.Schema$Presentation> {
	// Use the existing authorize function to authenticate, with verbose logging enabled
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const presentation = await slidesApi.presentations.create({
			requestBody: {
				title,
			},
		});

		console.log(
			`Created presentation with ID: ${presentation.data.presentationId}`,
		);
		return presentation.data; // Return the Schema$Presentation object
	} catch (err) {
		console.error("Failed to create presentation:", err);
		throw err;
	}
}
