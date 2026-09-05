import {
  getAllSeasons,
  createSeason,
  getSeason,
  updateSeason,
  deleteSeason,
} from "../controllers/season.controller";
import { Router } from "express";
import eventRouter from "./event.route";

const seasonRouter = Router();

seasonRouter.use("/:seasonId/events", eventRouter);

seasonRouter.get("/", getAllSeasons);

seasonRouter.get("/:seasonId", getSeason);

seasonRouter.post("/", createSeason);

seasonRouter.put("/:seasonId", updateSeason);

seasonRouter.delete("/:seasonId", deleteSeason);

export default seasonRouter;
