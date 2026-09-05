import {
  getAllMedia,
  createMedia,
  getMedia,
  updateMedia,
  deleteMedia,
} from "../controllers/media.controller";
import { Router } from "express";

const mediaRouter = Router();

mediaRouter.get("/", getAllMedia);

mediaRouter.get("/:mediaId", getMedia);

mediaRouter.post("/", createMedia);

mediaRouter.put("/:mediaId", updateMedia);

mediaRouter.delete("/:mediaId", deleteMedia);

export default mediaRouter;
