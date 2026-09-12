import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import specs from "./config/swagger.config";
import connectDB from "./config/mongoDB.config";
import authRouter from "./routes/auth.route";
import seasonRouter from "./routes/season.route";
import userRouter from "./routes/user.route";
import eventInfoRouter from "./routes/eventInfo.route";
import { globalErrorHandler } from "./middlewares/errorHandler.middleware";

const path = require("path");

const app: Application = express();
const PORT = (process.env.PORT as string) || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 40,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://via.placeholder.com",
        ],
      },
    },
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/uploads", express.static("uploads"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/api/auth", authRouter);
app.use("/api/seasons", seasonRouter);
app.use("/api/event-infos", eventInfoRouter);
app.use("/api/users", userRouter);

app.get("/*path", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

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
