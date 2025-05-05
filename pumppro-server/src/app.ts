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
app.use(bodyParser.json());
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

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use("/api/auth", authRouter);
app.use(tokenExtractor);
app.use(checkTokenExistence);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/product-sales", salesRoutes);
app.use("/api/fuel-sales", fuelSalesRoutes);
app.use("/api/salessummary", salesSummaryRoutes);
app.use("/api/daily-sales", dailySalesRoutes);
app.use("/api/fuel", fuelsRoutes);
app.use("/api/tank", tankRoutes);
app.use("/api/messages", messageNotificationsRoutes);

app.use("*", (_req, res) => {
	res.sendFile(path.join(__dirname, '..', 'dist', "index.html"));
});

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
