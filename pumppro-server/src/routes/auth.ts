/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express, { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { tokenExtractor } from "../../middlewares/jwt";
import { authenticateUser, verifyUser } from "../controller/auth";

const authRouter = express.Router();

authRouter.post("/", asyncHandler(authenticateUser as RequestHandler));

authRouter.get(
	"/user",
	tokenExtractor,
	asyncHandler(verifyUser as RequestHandler)
);

export default authRouter;
