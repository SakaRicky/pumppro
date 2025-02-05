import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import { getDailySales, saveDailySale } from "../controller/dailySales";

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

export default dailySalesRoutes;
