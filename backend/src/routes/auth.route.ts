import express, { Application, Request, Response } from "express";
import { login, register } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
