import {
  getAllMedia,
  createMedia,
  getMedia,
  updateMedia,
  deleteMedia,
} from "../controllers/media.controller";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const mediaRouter = Router({ mergeParams: true });

mediaRouter.get("/", getAllMedia);

mediaRouter.get("/:mediaId", getMedia);

mediaRouter.post("/", authenticate, createMedia);

// to update or delete media, you must be the owner of the media or an admin

mediaRouter.put("/:mediaId", authenticate, updateMedia);

mediaRouter.delete("/:mediaId", authenticate, deleteMedia);

export default mediaRouter;
