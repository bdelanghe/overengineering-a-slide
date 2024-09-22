import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService";

// Get object by ID (e.g., placeholder)
export async function getObjectById(
	presentationId: string,
	pageObjectId: string,
	objectId: string,
): Promise<slides_v1.Schema$PageElement> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const slide = await slidesApi.presentations.pages.get({
		presentationId,
		pageObjectId,
	});

	const element = slide.data.pageElements?.find(
		(element) => element.objectId === objectId,
	);

	if (!element) {
		throw new Error("Object not found.");
	}

	return element;
}

// Search objects by placeholder type
export async function searchObjectsByPlaceholder(
	presentationId: string,
	pageObjectId: string,
	placeholderType: string,
): Promise<slides_v1.Schema$PageElement[]> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	const slide = await slidesApi.presentations.pages.get({
		presentationId,
		pageObjectId,
	});

	return (
		slide.data.pageElements?.filter(
			(element) => element.shape?.placeholder?.type === placeholderType,
		) || []
	);
}

// Update object text content by ID
export async function updateObjectText(
	presentationId: string,
	objectId: string,
	text: string,
): Promise<void> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	await slidesApi.presentations.batchUpdate({
		presentationId,
		requestBody: {
			requests: [
				{
					insertText: {
						objectId,
						text,
					},
				},
			],
		},
	});
}

// Delete an object by ID
export async function deleteObject(
	presentationId: string,
	objectId: string,
): Promise<void> {
	const auth = await authorize(true);
	const slidesApi = google.slides({ version: "v1", auth });

	await slidesApi.presentations.batchUpdate({
		presentationId,
		requestBody: {
			requests: [
				{
					deleteObject: {
						objectId,
					},
				},
			],
		},
	});
}
