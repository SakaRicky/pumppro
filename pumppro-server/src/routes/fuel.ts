import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import {
	deleteFuel,
	getFuels,
	refillFuel,
	saveFuel,
	updateFuel
} from "../controller/fuel";

const fuelsRoutes = express.Router();

fuelsRoutes.get(
	"/",
	checkIfAdmin,
	asyncHandler(getFuels as unknown as RequestHandler)
);

fuelsRoutes.post(
	"/",
	checkIfAdmin,
	asyncHandler(saveFuel as unknown as RequestHandler)
);

fuelsRoutes.put(
	"/",
	checkIfAdmin,
	asyncHandler(updateFuel as unknown as RequestHandler)
);

fuelsRoutes.patch(
	"/",
	checkIfAdmin,
	asyncHandler(refillFuel as unknown as RequestHandler)
);

fuelsRoutes.delete(
	"/",
	checkIfAdmin,
	asyncHandler(deleteFuel as unknown as RequestHandler)
);

export default fuelsRoutes;
