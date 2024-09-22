import { google, slides_v1 } from "googleapis";
import { authorize } from "./authService"; // Import the authorize function from authService

export async function createPresentation(
	title: string,
): Promise<slides_v1.Schema$Presentation> {
	const auth = await authorize(true); // Authenticate
	const slidesApi = google.slides({ version: "v1", auth });

	try {
		const presentation = await slidesApi.presentations.create({
			requestBody: {
				title,
			},
		});

		console.log(
			`Created presentation with ID: ${presentation.data.presentationId}`,
		);
		return presentation.data;
	} catch (error) {
		console.error("Failed to create presentation:", error);
		throw error;
	}
}
