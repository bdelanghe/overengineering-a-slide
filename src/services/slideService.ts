import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService";

// Fetch presentation by title using the Google Drive API
export async function getPresentationByTitle(
	title: string,
): Promise<slides_v1.Schema$Presentation | null> {
	const auth = await authorize(true);
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

			return presentation.data as slides_v1.Schema$Presentation;
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error fetching presentation by title:", error);
		return null;
	}
}

// Create or fetch a Google Slide presentation and update the first slide's title
export async function createOrUpdatePresentation(
	title: string,
): Promise<slides_v1.Schema$Presentation> {
	const existingPresentation = await getPresentationByTitle(title);

	if (existingPresentation) {
		console.log(`Presentation with title "${title}" already exists.`);
		return existingPresentation;
	}

	// Create a new presentation
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const presentation = (
			await slidesApi.presentations.create({
				requestBody: {
					title,
				},
			})
		).data as slides_v1.Schema$Presentation;

		console.log(
			`Created new presentation with ID: ${presentation?.presentationId}`,
		);

		// Retrieve the first slide's title box (assumed to be the first placeholder)
		const firstSlide = presentation?.slides?.[0];
		const titleElement = firstSlide?.pageElements?.find(
			(element) => element.shape?.shapeType === "TITLE",
		);

		const titleObjectId = titleElement?.objectId;

		if (titleObjectId && presentation.presentationId) {
			// Update the title of the first slide
			await slidesApi.presentations.batchUpdate({
				presentationId: presentation.presentationId,
				requestBody: {
					requests: [
						{
							insertText: {
								objectId: titleObjectId,
								text: title,
							},
						},
					],
				},
			});
			console.log(`Updated the first slide's title to "${title}".`);
		} else {
			console.warn("No title element found in the first slide.");
		}

		return presentation;
	} catch (err) {
		console.error("Failed to create or update presentation:", err);
		throw err;
	}
}

// Fetch the details of the first slide in a presentation
export async function getFirstSlideElements(
	presentationId: string,
): Promise<slides_v1.Schema$PageElement[] | null> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		// Retrieve the presentation by ID
		const presentation = await slidesApi.presentations.get({ presentationId });
		const slides = presentation.data.slides;

		if (!slides || slides.length === 0) {
			console.log("No slides found in the presentation.");
			return null;
		}

		// Get the first slide
		const firstSlide = slides[0];
		const elements = firstSlide.pageElements;

		return elements || null;
	} catch (error) {
		console.error("Error fetching first slide elements:", error);
		return null;
	}
}
