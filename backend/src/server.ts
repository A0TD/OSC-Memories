import "dotenv/config";
import express, { Application, Request, Response } from "express";
import swaggerUI from "swagger-ui-express";
import connectDB from "./config/mongoDB.config";
import specs from "./config/swagger.config";
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app: Application = express();
const PORT = (process.env.PORT as string) || 3000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
