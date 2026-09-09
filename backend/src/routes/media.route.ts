import {
  getAllMedia,
  getMedia,
  deleteMedia,
  uploadMedia,
} from "../controllers/media.controller";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const mediaRouter = Router({ mergeParams: true });

mediaRouter.get("/", getAllMedia);

mediaRouter.get("/:mediaId", getMedia);

mediaRouter.post(
  "/",
  authenticate,
  upload.array("media", 5), // 5 is the limit for a single upload.
  uploadMedia,
);

mediaRouter.delete("/:mediaId", authenticate, deleteMedia);

export default mediaRouter;
