import { google, slides_v1 } from "googleapis";
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
			pageObjectId: pageId,
		});

		return response.data || null;
	} catch (error) {
		console.error(`Error fetching page by ID: ${error}`);
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

	try {
		const response = await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: {
				requests: [
					{
						createSlide: {
							objectId: `slide_${index}`, // You can create a custom object ID
							insertionIndex: index,
						},
					},
					{
						insertText: {
							objectId: `slide_${index}`,
							text: title,
							insertionIndex: 0, // Insert at the beginning of the text box
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
		await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: {
				requests: [
					{
						insertText: {
							objectId: pageId,
							text: title,
							insertionIndex: 0,
						},
					},
				],
			},
		});

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
							objectId: pageId,
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
