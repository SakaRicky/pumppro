import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import {
	deleteProductCategory,
	getOneProductCategory,
	getProductCategories,
	saveProductCategory,
	updateProductCategory
} from "../controller/productsCategories";

const categoriesRoutes = express.Router();

categoriesRoutes.get(
	"/products",
	asyncHandler(getProductCategories as RequestHandler)
);

categoriesRoutes.get(
	"/products/:id",
	checkIfAdmin,
	asyncHandler(getOneProductCategory as RequestHandler)
);

categoriesRoutes.post(
	"/products",
	checkIfAdmin,
	asyncHandler(saveProductCategory as RequestHandler)
);

categoriesRoutes.put(
	"products/",
	checkIfAdmin,
	asyncHandler(updateProductCategory as RequestHandler)
);

categoriesRoutes.delete(
	"products/",
	checkIfAdmin,
	asyncHandler(deleteProductCategory as RequestHandler)
);

export default categoriesRoutes;
