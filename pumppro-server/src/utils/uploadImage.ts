import { v2 } from "cloudinary";
import config from "./config";
import multerUtils from "./multer";

const cloudinary = v2;

// Return "https" URLs by setting secure: true
cloudinary.config(config.CLOUDINARY_CONFIG);

export const uploadImage = async (
	imageFile: Express.Multer.File,
	folder: string
): Promise<string> => {
	const fileFormat = imageFile.mimetype.split("/")[1];
	const imageToSave = multerUtils.bufferToDataURI(fileFormat, imageFile.buffer);

	// if the content of the image to undefined, we save an empty string in the db
	if (!imageToSave.content) {
		return "";
	}

	// Use the uploaded file's name as the asset's public ID and
	// allow overwriting the asset with new versions
	const options = {
		use_filename: false,
		unique_filename: false,
		overwrite: true,
		folder: `pumppro/${folder}`
	};

	try {
		// Upload the image
		const result = await cloudinary.uploader.upload(
			imageToSave.content,
			options
		);
		return result.secure_url;
	} catch (error: any) {
		throw new Error("Cloudinary Error");
	}
};
