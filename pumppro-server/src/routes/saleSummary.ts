import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { getSalesSummary } from "../controller/saleSummary";

const salesSummaryRoutes = express.Router();

salesSummaryRoutes.get(
	"/",
	asyncHandler(getSalesSummary as unknown as RequestHandler)
);

export default salesSummaryRoutes;
