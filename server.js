import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import cors from "cors";
import { serverInfo } from "./utils/log.js";
import colors from "colors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import productRoute from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { uploadImages } from "./utils/fileHandler.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
dotenv.config();
const app = express();

connectDb();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
// ENDPOINTS ROUTES
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/v1/products", uploadImages, productRoute);
app.use("/api/v1/orders", orderRouter);

app.use("/api/v1/users", userRoutes);
app.use("/", (req, res, next) =>
  res.status(200).json({ message: "welcome  to our api" })
);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => serverInfo("SERVER", `server running on ${PORT}`));
