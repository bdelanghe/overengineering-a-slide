import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService";

// Fetch presentation by title using the Google Drive API
export async function getPresentationByTitle(
	title: string,
): Promise<slides_v1.Schema$Presentation | null> {
	const auth = await authorize(true); // Pass the verbose argument
	const drive = google.drive({ version: "v3", auth });

	try {
		// Search for the presentation by title in Google Drive
		const response = await drive.files.list({
			q: `name='${title}' and mimeType='application/vnd.google-apps.presentation'`,
			fields: "files(id, name)",
		});

		const files = response.data.files;

		if (files && files.length > 0) {
			const presentationId = files[0].id;
			if (!presentationId) {
				throw new Error("Presentation ID is null or undefined.");
			}

			// Retrieve the presentation by ID using the Slides API
			const slides = google.slides({ version: "v1", auth });
			const presentation = await slides.presentations.get({ presentationId });

			return presentation.data as slides_v1.Schema$Presentation; // Return the presentation if found
		} else {
			return null; // No presentation found with the given title
		}
	} catch (error) {
		console.error("Error fetching presentation by title:", error);
		return null;
	}
}

// Create a new Google Slide presentation
export async function createPresentation(
	title: string,
): Promise<slides_v1.Schema$Presentation> {
	const auth = await authorize(true); // Pass the verbose argument
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const presentation = await slidesApi.presentations.create({
			requestBody: {
				title,
			},
		});

		console.log(
			`Created presentation with ID: ${presentation.data?.presentationId}`,
		);
		return presentation.data as slides_v1.Schema$Presentation; // Ensure type correctness
	} catch (err) {
		console.error("Failed to create presentation:", err);
		throw err;
	}
}
