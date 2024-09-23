import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService";

/**
 * Get a presentation by ID
 */
export async function getPresentationById(
	presentationId: string,
): Promise<slides_v1.Schema$Presentation | null> {
	const auth = await authorize(true); // Pass verbose as true
	const slides = google.slides({ version: "v1", auth });

	try {
		const presentation = await slides.presentations.get({ presentationId });
		return presentation.data || null;
	} catch (error) {
		console.error(
			`Error fetching presentation by ID: ${presentationId}`,
			error,
		);
		return null;
	}
}

/**
 * Create a new presentation
 */
export async function createNewPresentation(
	title: string,
): Promise<slides_v1.Schema$Presentation | null> {
	const auth = await authorize(true); // Pass verbose as true
	const slides = google.slides({ version: "v1", auth });

	try {
		const presentation = await slides.presentations.create({
			requestBody: { title },
		});
		return presentation.data || null;
	} catch (error) {
		console.error("Error creating new presentation:", error);
		return null;
	}
}

/**
 * Update a presentation by ID
 */
export async function updatePresentation(
	presentationId: string,
	newTitle: string,
): Promise<slides_v1.Schema$Presentation | null> {
	const auth = await authorize(true); // Pass verbose as true
	const slides = google.slides({ version: "v1", auth });

	try {
		// Create the request body for batch update
		const batchUpdateRequest: slides_v1.Schema$BatchUpdatePresentationRequest =
			{
				requests: [
					{
						replaceAllText: {
							containsText: {
								text: "{{PRESENTATION_TITLE}}", // Assuming your presentation title has this placeholder
								matchCase: true,
							},
							replaceText: newTitle,
						},
					},
				],
			};

		// Call the batchUpdate method with the correct structure
		await slides.presentations.batchUpdate({
			presentationId,
			requestBody: batchUpdateRequest,
		});

		// Fetch and return the updated presentation
		return await getPresentationById(presentationId);
	} catch (error) {
		console.error(`Error updating presentation: ${presentationId}`, error);
		return null;
	}
}

/**
 * Delete a presentation by ID
 */
export async function deletePresentationById(
	presentationId: string,
): Promise<boolean> {
	const auth = await authorize(true); // Pass verbose as true
	const drive = google.drive({ version: "v3", auth });

	try {
		await drive.files.delete({ fileId: presentationId });
		return true;
	} catch (error) {
		console.error(
			`Error deleting presentation by ID: ${presentationId}`,
			error,
		);
		return false;
	}
}

/**
 * Search presentations by title
 */
export async function searchPresentationsByTitle(
	title: string,
): Promise<slides_v1.Schema$Presentation[]> {
	const auth = await authorize(true); // Pass verbose as true
	const drive = google.drive({ version: "v3", auth });

	try {
		const response = await drive.files.list({
			q: `name contains '${title}' and mimeType = 'application/vnd.google-apps.presentation'`,
			fields: "files(id, name)",
		});

		const files = response.data.files || [];
		const presentations: slides_v1.Schema$Presentation[] = [];

		for (const file of files) {
			if (file.id) {
				const presentation = await getPresentationById(file.id);
				if (presentation) {
					presentations.push(presentation);
				}
			}
		}

		return presentations;
	} catch (error) {
		console.error("Error searching presentations by title:", error);
		throw error;
	}
}

/**
 * Upsert a presentation by title
 * If a presentation with the title exists, update its title, otherwise create a new one.
 */
export async function upsertPresentationByTitle(
	title: string,
	newTitle: string,
): Promise<slides_v1.Schema$Presentation | null> {
	const existingPresentations = await searchPresentationsByTitle(title);

	if (existingPresentations.length > 0) {
		const presentation = existingPresentations[0]; // Update the first match
		return await updatePresentation(
			presentation.presentationId ?? "",
			newTitle,
		);
	} else {
		return await createNewPresentation(newTitle);
	}
}
