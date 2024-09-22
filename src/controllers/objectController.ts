import { Request, Response } from "express";
import {
	getObjectById,
	searchObjectsByPlaceholder,
	updateObjectText,
	deleteObject,
} from "../services/objectService";

// Get object by ID
export const getObject = async (req: Request, res: Response) => {
	const { presentationId, pageObjectId, objectId } = req.params;
	try {
		const object = await getObjectById(presentationId, pageObjectId, objectId);
		res.status(200).json(object);
	} catch (error) {
		res.status(500).json({ message: `Error retrieving object: ${error}` });
	}
};

// Search objects by placeholder type
export const searchObjects = async (req: Request, res: Response) => {
	const { presentationId, pageObjectId } = req.params;
	const { placeholderType } = req.query;
	try {
		const objects = await searchObjectsByPlaceholder(
			presentationId,
			pageObjectId,
			placeholderType as string,
		);
		res.status(200).json(objects);
	} catch (error) {
		res.status(500).json({ message: `Error searching objects: ${error}` });
	}
};

// Update object text
export const updateObject = async (req: Request, res: Response) => {
	const { presentationId, objectId } = req.params;
	const { text } = req.body;
	try {
		await updateObjectText(presentationId, objectId, text);
		res.status(200).json({ message: "Object updated successfully" });
	} catch (error) {
		res.status(500).json({ message: `Error updating object: ${error}` });
	}
};

// Delete an object by ID
export const deleteSlideObject = async (req: Request, res: Response) => {
	const { presentationId, objectId } = req.params;
	try {
		await deleteObject(presentationId, objectId);
		res.status(200).json({ message: "Object deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: `Error deleting object: ${error}` });
	}
};
