import express, { RequestHandler } from "express";
import {
	getOneUser,
	getUsers,
	saveUser,
	updateUser,
	deleteUser
} from "../controller/users";
import multerUtils from "../utils/multer";
import asyncHandler from "express-async-handler";
import { checkIfAdmin } from "../../middlewares/jwt";

const usersRoute = express.Router();

usersRoute.get("/", asyncHandler(getUsers as unknown as RequestHandler));
usersRoute.get("/:id", asyncHandler(getOneUser as RequestHandler));

usersRoute.post(
	"/",
	checkIfAdmin,
	multerUtils.multerUploads,
	asyncHandler(saveUser as RequestHandler)
);

usersRoute.put(
	"/",
	checkIfAdmin,
	multerUtils.multerUploads,
	asyncHandler(updateUser as RequestHandler)
);

usersRoute.delete(
	"/",
	checkIfAdmin,
	asyncHandler(deleteUser as RequestHandler)
);

export default usersRoute;
