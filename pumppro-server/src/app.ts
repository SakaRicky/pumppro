/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import session from "express-session";
import cors from "cors";
import { setHeaders, requestLogger, unknownEndpoint } from "./utils/middleware";
import config from "./utils/config";
import bodyParser from "body-parser";

import authRouter from "./routes/auth";
import usersRoute from "./routes/user";
import { errorHandler } from "./errors";
import { checkTokenExistence, tokenExtractor } from "../middlewares/jwt";
import productsRoutes from "./routes/products";
import categoriesRoutes from "./routes/categories";
import salesRoutes from "./routes/sales";
import salesSummaryRoutes from "./routes/saleSummary";
import dailySalesRoutes from "./routes/dailySales";
import fuelsRoutes from "./routes/fuel";
import tankRoutes from "./routes/tank";
import messageNotificationsRoutes from "./routes/notifications";
import fuelSalesRoutes from "./routes/fuelSales";
import path from "path";

// Create a new express app
const app = express();

const corsOptions = {
	origin: true, // Allow all origins
	credentials: true,
	optionSuccessStatus: 200,
  };
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: config.SESSION_SECRET,
		resave: true,
		saveUninitialized: false
	})
);

// Add headers before the routes are defined
app.use(setHeaders);

app.use(requestLogger);

app.use(express.static(path.join(__dirname, "..", "..", 'public')));

app.use("/api/auth", authRouter);

const authenticatedApiRouter = express.Router();

authenticatedApiRouter.use(tokenExtractor);
authenticatedApiRouter.use(checkTokenExistence);

authenticatedApiRouter.use("/users", usersRoute);
authenticatedApiRouter.use("/products", productsRoutes);
authenticatedApiRouter.use("/categories", categoriesRoutes);
authenticatedApiRouter.use("/product-sales", salesRoutes);
authenticatedApiRouter.use("/fuel-sales", fuelSalesRoutes);
authenticatedApiRouter.use("/salessummary", salesSummaryRoutes);
authenticatedApiRouter.use("/daily-sales", dailySalesRoutes);
authenticatedApiRouter.use("/fuel", fuelsRoutes);
authenticatedApiRouter.use("/tank", tankRoutes);
authenticatedApiRouter.use("/messages", messageNotificationsRoutes);

app.use("/api", authenticatedApiRouter);

app.get('*', (_req, res) => {
	const filePath = path.join(__dirname, '..', "..", 'public', "index.html");
	res.sendFile(filePath);
  });

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
