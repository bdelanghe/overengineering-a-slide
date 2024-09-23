import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService"; // Assuming an authService for authorization
import { v4 as uuidv4 } from "uuid"; // Use UUID for generating unique object IDs

// Search for all elements on a page or a specific one by index
export const searchPageElementsService = async (
	presentationId: string,
	pageId: string,
): Promise<slides_v1.Schema$PageElement[]> => {
	const auth = await authorize(true); // Authorize with Google Slides API
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const response = await slidesApi.presentations.pages.get({
			presentationId,
			pageObjectId: pageId,
		});

		const page = response.data;
		if (!page || !page.pageElements) {
			return [];
		}

		return page.pageElements || [];
	} catch (error) {
		console.error(`Error retrieving page elements: ${error}`);
		throw error;
	}
};

// Get a page element by its ID
export const getPageElementByIdService = async (
	presentationId: string,
	pageId: string,
	elementId: string,
): Promise<slides_v1.Schema$PageElement | null> => {
	const auth = await authorize(true); // Authorize with Google Slides API
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const response = await slidesApi.presentations.pages.get({
			presentationId,
			pageObjectId: pageId,
		});

		const pageElements = response.data.pageElements || [];
		const element = pageElements.find((e) => e.objectId === elementId);

		return element || null;
	} catch (error) {
		console.error(`Error retrieving page element by ID: ${error}`);
		throw error;
	}
};

// Create a new page element (e.g., text box) on the slide
export const createPageElementService = async (
	presentationId: string,
	pageId: string,
	type: string, // E.g., TEXT_BOX
	text: string,
): Promise<slides_v1.Schema$PageElement | null> => {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const elementId = `element_${uuidv4()}`;

	const requests: slides_v1.Schema$Request[] = [
		{
			createShape: {
				objectId: elementId,
				shapeType: type,
				elementProperties: {
					pageObjectId: pageId,
					size: {
						height: { magnitude: 3000000, unit: "EMU" },
						width: { magnitude: 3000000, unit: "EMU" },
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
		{
			insertText: {
				objectId: elementId,
				text,
			},
		},
	];

	try {
		const response = await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: { requests },
		});

		const createdElement = response.data.replies?.[0]?.createShape?.objectId;
		return { objectId: createdElement } as slides_v1.Schema$PageElement;
	} catch (error) {
		console.error(`Error creating page element: ${error}`);
		throw error;
	}
};

// Update a page element's text by its ID
export const updatePageElementByIdService = async (
	presentationId: string,
	pageId: string,
	elementId: string,
	text: string,
): Promise<slides_v1.Schema$PageElement | null> => {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const requests: slides_v1.Schema$Request[] = [
		{
			replaceAllText: {
				objectId: elementId,
				text,
			},
		},
	];

	try {
		await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: { requests },
		});

		return await getPageElementByIdService(presentationId, pageId, elementId);
	} catch (error) {
		console.error(`Error updating page element: ${error}`);
		throw error;
	}
};

// Delete a page element by its ID
export const deletePageElementService = async (
	presentationId: string,
	pageId: string,
	elementId: string,
): Promise<void> => {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const requests: slides_v1.Schema$Request[] = [
		{
			deleteObject: {
				objectId: elementId,
			},
		},
	];

	try {
		await slidesApi.presentations.batchUpdate({
			presentationId,
			requestBody: { requests },
		});
	} catch (error) {
		console.error(`Error deleting page element: ${error}`);
		throw error;
	}
};
