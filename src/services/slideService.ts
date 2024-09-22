import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService";

// Fetch presentation by title using the Google Drive API
export async function getPresentationByTitle(
	title: string,
): Promise<slides_v1.Schema$Presentation | null> {
	const auth = await authorize(true); // Pass the verbose argument
	const drive = google.drive({ version: "v3", auth });

	try {
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

			const slides = google.slides({ version: "v1", auth });
			const presentation = await slides.presentations.get({ presentationId });

			return presentation.data as slides_v1.Schema$Presentation; // Return the presentation
		} else {
			return null;
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

// Update placeholders in the first slide dynamically based on type
export async function updateFirstSlidePlaceholders(
	presentationId: string,
	titleText: string,
	subtitleText: string,
): Promise<void> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const slideResponse = await slidesApi.presentations.pages.get({
			presentationId,
			pageObjectId: "p", // Assume 'p' refers to the first slide.
		});

		const slideElements = slideResponse.data.pageElements;
		if (!slideElements) {
			throw new Error("No elements found on the first slide.");
		}

		// Find the placeholder objects dynamically by type
		const titlePlaceholder = slideElements.find(
			(el) => el.shape?.placeholder?.type === "CENTERED_TITLE",
		);
		const subtitlePlaceholder = slideElements.find(
			(el) => el.shape?.placeholder?.type === "SUBTITLE",
		);

		if (!titlePlaceholder?.objectId || !subtitlePlaceholder?.objectId) {
			throw new Error("Placeholder IDs for title or subtitle not found.");
		}

		// Prepare batchUpdate request to update title and subtitle
		const requests: slides_v1.Schema$Request[] = [
			{
				insertText: {
					objectId: titlePlaceholder.objectId,
					text: titleText,
				},
			},
			{
				insertText: {
					objectId: subtitlePlaceholder.objectId,
					text: subtitleText,
				},
			},
		];

		await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: { requests },
		});

		console.log("Title and subtitle updated dynamically.");
	} catch (error) {
		console.error("Failed to update slide text:", error);
		throw error;
	}
}

// Retrieve the full presentation object by ID
export async function getPresentationById(
	presentationId: string,
): Promise<slides_v1.Schema$Presentation> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const presentation = await slidesApi.presentations.get({ presentationId });
	return presentation.data;
}

// Retrieve the full slide object by presentationId and slideId
export async function getSlideById(
	presentationId: string,
	slideId: string,
): Promise<slides_v1.Schema$Page> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const slide = await slidesApi.presentations.pages.get({
		presentationId,
		pageObjectId: slideId,
	});

	return slide.data;
}
