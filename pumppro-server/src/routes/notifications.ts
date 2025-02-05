import express, { RequestHandler } from "express";

import asyncHandler from "express-async-handler";
import {
	getMessageNotifications,
	updateMessageNotification
} from "../controller/notification";

const messageNotificationsRoutes = express.Router();

messageNotificationsRoutes.get(
	"/",
	asyncHandler(getMessageNotifications as unknown as RequestHandler)
);

messageNotificationsRoutes.put(
	"/",
	asyncHandler(updateMessageNotification as unknown as RequestHandler)
);

export default messageNotificationsRoutes;
