import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import specs from "./config/swagger.config";
import connectDB from "./config/mongoDB.config";
import authRouter from "./routes/auth.route";
import seasonRouter from "./routes/season.route";
import adminRouter from "./routes/admin.route";
import eventInfoRouter from "./routes/eventInfo.route";
import { globalErrorHandler } from "./middlewares/errorHandler.middleware";

const app: Application = express();
const PORT = (process.env.PORT as string) || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/api/auth", authRouter);
app.use("/api/seasons", seasonRouter);
app.use("/api/event-infos", eventInfoRouter);
app.use("/api/admin", adminRouter);

app.use(globalErrorHandler);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening on  http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
