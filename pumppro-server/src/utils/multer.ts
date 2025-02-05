// import { Request } from "express";
import multer from "multer";
// import path from "path";
// import fs from "fs";

import DatauriParser from "datauri/parser";

// var storage = multer.diskStorage({
// 	destination: function (req: Request, _file, cb) {
// 		const uploadsDir = path.resolve(__dirname, "..", "..", "public/images");
// 		const uploadFolder = path.join(uploadsDir, req.originalUrl.split("/")[1]);

// 		if (!fs.existsSync(uploadFolder)) {
// 			fs.mkdirSync(uploadFolder, { recursive: true });
// 		}
// 		cb(null, uploadFolder);
// 	},
// 	filename: function (_req: Request, file, cb) {
// 		const savedFileName = Date.now() + path.extname(file.originalname);
// 		cb(null, savedFileName); //Appending extension
// 	}
// });

// export const upload = multer({ storage: storage });

const parser = new DatauriParser();

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const bufferToDataURI = (fileFormat: string, buffer: Buffer) =>
	parser.format(fileFormat, buffer);

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("file");
const multerUtils = { multerUploads, bufferToDataURI };
export default multerUtils;
