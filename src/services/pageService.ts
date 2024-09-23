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

// Create a new page (slide) in the presentation
export const createPageService = async (
	presentationId: string,
	title: string,
	index: number,
	predefined_layout?: string, // Optional predefined layout
): Promise<slides_v1.Schema$Response[] | undefined> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const createSlideRequest: slides_v1.Schema$CreateSlideRequest = {
			objectId: `slide_${uuidv4()}`,
			insertionIndex: index,
		};

		// Add the predefined layout if it was provided
		if (predefined_layout) {
			createSlideRequest.slideLayoutReference = {
				predefinedLayout: predefined_layout,
			};
		}

		// Prepare the batchUpdate request
		const requests: slides_v1.Schema$Request[] = [
			{
				createSlide: createSlideRequest,
			},
		];

		// Make the API call
		const response = await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: {
				requests,
			},
		});

		return response.data.replies;
	} catch (error) {
		console.error(`Error creating page: ${error}`);
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
	layoutObjectId?: string,
	masterObjectId?: string,
	pageType = "SLIDE", // Default to 'SLIDE'
): Promise<slides_v1.Schema$Page[]> => {
	const auth = await authorize(true); // Assuming authorization service
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const response = await slidesApi.presentations.get({
			presentationId,
		});

		const pages = response.data.slides || [];

		const getPageType = (page: slides_v1.Schema$Page): string => {
			if (page?.notesProperties) {
				return "NOTES";
			}
			if (page?.layoutProperties) {
				return "LAYOUT";
			}
			if (page?.masterProperties) {
				return "MASTER";
			}
			if (page?.slideProperties) {
				return "SLIDE";
			}
			return "SLIDE"; // Default to SLIDE if no specific properties exist
		};

		// Filter pages based on layoutObjectId, masterObjectId, and inferred pageType
		return pages.filter((page) => {
			const layoutMatch =
				!layoutObjectId ||
				page?.slideProperties?.layoutObjectId === layoutObjectId;
			const masterMatch =
				!masterObjectId ||
				page?.slideProperties?.masterObjectId === masterObjectId;
			const inferredPageType = getPageType(page);
			const typeMatch = inferredPageType === pageType;

			return layoutMatch && masterMatch && typeMatch;
		});
	} catch (error) {
		console.error(`Error retrieving pages: ${error}`);
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

		return await getPageByIndexService(presentationId, parseInt(pageId)); // Assuming pageId is an index here
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
