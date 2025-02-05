import express, { RequestHandler } from "express";

import multerUtils from "../utils/multer";
import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import {
	deleteProduct,
	updateProduct,
	getOneProduct,
	getProducts,
	saveProduct
} from "../controller/products";

const productsRoutes = express.Router();

productsRoutes.get("/", asyncHandler(getProducts as unknown as RequestHandler));

productsRoutes.get(
	"/:id",
	checkIfAdmin,
	asyncHandler(getOneProduct as RequestHandler)
);

productsRoutes.post(
	"/",
	checkIfAdmin,
	multerUtils.multerUploads,
	asyncHandler(saveProduct as RequestHandler)
);

productsRoutes.put(
	"/",
	checkIfAdmin,
	multerUtils.multerUploads,
	asyncHandler(updateProduct as RequestHandler)
);

productsRoutes.delete(
	"/",
	checkIfAdmin,
	asyncHandler(deleteProduct as RequestHandler)
);

export default productsRoutes;
