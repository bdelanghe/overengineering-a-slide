import { google, slides_v1 } from "googleapis";
import { v4 as uuidv4 } from "uuid"; // Import a UUID generator
import { authorize } from "./authService"; // Assume this is the authorization service

// Get a page (slide) by its ID
export const getPageByIdService = async (
	presentationId: string,
	pageId: string,
): Promise<slides_v1.Schema$Page | null> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const response = await slidesApi.presentations.pages.get({
			presentationId,
			pageObjectId: pageId, // Use pageId as a string
		});

		return response.data || null;
	} catch (error) {
		console.error(`Error fetching page by ID: ${error}`);
		throw error;
	}
};

// Get a page (slide) by index
export const getPageByIndexService = async (
	presentationId: string,
	index: number,
): Promise<slides_v1.Schema$Page | null> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const response = await slidesApi.presentations.get({
			presentationId,
		});

		const pages = response.data.slides || [];

		// Return the page at the specified index, if it exists
		if (index >= 0 && index < pages.length) {
			return pages[index] || null;
		}

		return null; // Index out of range
	} catch (error) {
		console.error(`Error fetching page by index: ${error}`);
		throw error;
	}
};

// Search pages (slides) by index or placeholder
export const searchPagesService = async (
	presentationId: string,
): Promise<slides_v1.Schema$Page[]> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const response = await slidesApi.presentations.get({
			presentationId,
		});

		const pages = response.data.slides || [];
		return pages;
	} catch (error) {
		console.error(`Error searching pages: ${error}`);
		throw error;
	}
};

// Create a new page (slide) in the presentation
export const createPageService = async (
	presentationId: string,
	title: string,
	index: number,
): Promise<slides_v1.Schema$Page> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	// Generate a unique ID for the slide and text box
	const slideId = `slide_${uuidv4()}`;
	const textBoxId = `text_box_${uuidv4()}`;

	try {
		// Step 1: Create a new slide
		const response = await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: {
				requests: [
					{
						createSlide: {
							objectId: slideId,
							insertionIndex: index,
						},
					},
					// Step 2: Create a text box on the newly created slide
					{
						createShape: {
							objectId: textBoxId,
							shapeType: "TEXT_BOX",
							elementProperties: {
								pageObjectId: slideId, // The slide we just created
								size: {
									width: { magnitude: 3000000, unit: "EMU" },
									height: { magnitude: 3000000, unit: "EMU" },
								},
								transform: {
									scaleX: 1,
									scaleY: 1,
									translateX: 100000,
									translateY: 100000,
									unit: "EMU",
								},
							},
						},
					},
					// Step 3: Insert text into the created text box
					{
						insertText: {
							objectId: textBoxId,
							text: title,
							insertionIndex: 0,
						},
					},
				],
			},
		});

		const createdSlide = response.data.replies?.[0].createSlide?.objectId;
		return { objectId: createdSlide || null } as slides_v1.Schema$Page; // Return the created page object
	} catch (error) {
		console.error(`Error creating page: ${error}`);
		throw error;
	}
};

// Update a page (slide) by ID
export const updatePageByIdService = async (
	presentationId: string,
	pageId: string,
	title: string,
): Promise<slides_v1.Schema$Page | null> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		// Instead of `insertText`, you can update text in a shape using `replaceAllText`
		await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: {
				requests: [
					{
						replaceAllText: {
							containsText: {
								text: "{{PAGE_TITLE}}", // Assuming there's a placeholder for the title
								matchCase: true,
							},
							replaceText: title,
						},
					},
				],
			},
		});

		// Retrieve the updated page
		return await getPageByIdService(presentationId, pageId);
	} catch (error) {
		console.error(`Error updating page: ${error}`);
		throw error;
	}
};

// Delete a page (slide) by ID
export const deletePageService = async (
	presentationId: string,
	pageId: string,
): Promise<void> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: {
				requests: [
					{
						deleteObject: {
							objectId: pageId, // Ensure pageId is the correct slide object ID
						},
					},
				],
			},
		});
	} catch (error) {
		console.error(`Error deleting page: ${error}`);
		throw error;
	}
};
