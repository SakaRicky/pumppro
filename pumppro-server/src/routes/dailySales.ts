import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import { deleteDailySale, getDailySales, saveDailySale, updateDailySale } from "../controller/dailySales/dailySales";

const dailySalesRoutes = express.Router();

dailySalesRoutes.get(
	"/",
	checkIfAdmin,
	asyncHandler(getDailySales as unknown as RequestHandler)
);

dailySalesRoutes.post(
	"/",
	checkIfAdmin,
	asyncHandler(saveDailySale as unknown as RequestHandler)
);

dailySalesRoutes.patch(
	"/",
	checkIfAdmin,
	asyncHandler(updateDailySale as unknown as RequestHandler)
);

dailySalesRoutes.delete(
	"/",
	checkIfAdmin,
	asyncHandler(deleteDailySale as unknown as RequestHandler)
);

export default dailySalesRoutes;
