import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";
import {
    deleteFuelSale,
    getOneFuelSale,
    getFuelSales,
    saveFuelSale,
    updateFuelSale
} from "../controller/fuelSale";

const fuelSalesRoutes = express.Router();

fuelSalesRoutes.get("/", asyncHandler(getFuelSales as unknown as RequestHandler));

fuelSalesRoutes.get(
    "/:id",
    checkIfAdmin,
    asyncHandler(getOneFuelSale as RequestHandler)
);

fuelSalesRoutes.post("/", asyncHandler(saveFuelSale as RequestHandler));

fuelSalesRoutes.put("/", checkIfAdmin, asyncHandler(updateFuelSale as RequestHandler));

fuelSalesRoutes.delete(
    "/",
    checkIfAdmin,
    asyncHandler(deleteFuelSale as RequestHandler)
);

export default fuelSalesRoutes;
