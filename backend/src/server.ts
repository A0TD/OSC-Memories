import express, { Application,Request,Response } from "express";
import swaggerUI from "swagger-ui-express"
import "dotenv/config";
import connectDB from "./config/mongoDB.config";
import specs from "./config/swagger.config";

const app: Application = express();
const PORT = (process.env.PORT as string) || 3000;

//connectDB();

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(specs))

app.get("/", (req:Request, res:Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
