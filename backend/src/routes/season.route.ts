import {
  getAllSeasons,
  createSeason,
  getSeasonById,
  updateSeason,
  deleteSeason,
  deleteAllSeasons,
} from "../controllers/season.controller";
import { Router } from "express";
import eventRouter from "./event.route";

const seasonRouter = Router();

seasonRouter.use("/:seasonId/events", eventRouter);

seasonRouter.get("/", getAllSeasons);

seasonRouter.get("/:seasonId", getSeasonById);

seasonRouter.post("/", createSeason);

seasonRouter.put("/:seasonId", updateSeason);

seasonRouter.delete("/", deleteAllSeasons);

seasonRouter.delete("/:seasonId", deleteSeason);

export default seasonRouter;
