import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import {
	deleteSale,
	getAllSalesForUser,
	getOneSale,
	getSales,
	saveSale,
	updateSale
} from "../controller/sales";

const salesRoutes = express.Router();

salesRoutes.get("/", asyncHandler(getSales as unknown as RequestHandler));

salesRoutes.get("/all", asyncHandler(getAllSalesForUser as unknown as RequestHandler));

salesRoutes.get(
	"/:id",
	checkIfAdmin,
	asyncHandler(getOneSale as RequestHandler)
);

salesRoutes.post("/", asyncHandler(saveSale as RequestHandler));

salesRoutes.put("/", checkIfAdmin, asyncHandler(updateSale as RequestHandler));

salesRoutes.delete(
	"/",
	checkIfAdmin,
	asyncHandler(deleteSale as RequestHandler)
);

export default salesRoutes;
