import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import { getTanks, saveTank, updateTank } from "../controller/tank";

const tankRoutes = express.Router();

tankRoutes.get(
	"/",
	checkIfAdmin,
	asyncHandler(getTanks as unknown as RequestHandler)
);

tankRoutes.post(
	"/",
	checkIfAdmin,
	asyncHandler(saveTank as unknown as RequestHandler)
);

tankRoutes.put(
	"/",
	checkIfAdmin,
	asyncHandler(updateTank as unknown as RequestHandler)
);

export default tankRoutes;
