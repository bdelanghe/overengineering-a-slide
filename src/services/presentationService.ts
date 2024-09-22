import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService";

// Create a new Google Slide presentation
export const createPresentation = async (
	title: string,
): Promise<slides_v1.Schema$Presentation> => {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const presentation = await slidesApi.presentations.create({
		requestBody: { title },
	});

	return presentation.data as slides_v1.Schema$Presentation;
};

// Get a presentation by ID
export const getPresentationById = async (
	presentationId: string,
): Promise<slides_v1.Schema$Presentation | null> => {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const presentation = await slidesApi.presentations.get({ presentationId });
		return presentation.data;
	} catch (error) {
		console.error("Error fetching presentation:", error);
		return null;
	}
};

// Search presentations by title in Google Drive
export const searchPresentationsByTitle = async (
	title: string,
): Promise<slides_v1.Schema$Presentation[]> => {
	const auth = await authorize(true);
	const drive = google.drive({ version: "v3", auth });

	const response = await drive.files.list({
		q: `name contains '${title}' and mimeType='application/vnd.google-apps.presentation'`,
		fields: "files(id, name)",
	});

	return response.data.files as slides_v1.Schema$Presentation[]; // Cast to Presentation
};

// Update presentation title
export const updatePresentationTitle = async (
	presentationId: string,
	newTitle: string,
): Promise<slides_v1.Schema$Presentation | null> => {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: {
				requests: [
					{
						updatePresentationProperties: {
							objectId: presentationId,
							presentationProperties: {
								title: newTitle,
							},
							fields: "title",
						},
					},
				],
			},
		});

		// Return the updated presentation
		const updatedPresentation = await getPresentationById(presentationId);
		return updatedPresentation;
	} catch (error) {
		console.error("Error updating presentation title:", error);
		return null;
	}
};

// Delete a presentation by ID
export const deletePresentationById = async (
	presentationId: string,
): Promise<boolean> => {
	const auth = await authorize(true);
	const drive = google.drive({ version: "v3", auth });

	try {
		await drive.files.delete({ fileId: presentationId });
		return true;
	} catch (error) {
		console.error("Error deleting presentation:", error);
		return false;
	}
};
