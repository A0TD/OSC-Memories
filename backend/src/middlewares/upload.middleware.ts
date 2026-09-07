import cloudinary from "../config/cloudinary.config.js";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

const uploadMultiple = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const images: any = req.files;
      console.log(images);
      const imageUrls = [];

      for (const image of images) {
        const result = await cloudinary.uploader.upload(image.path);

        imageUrls.push(result.secure_url);

        (req as any).images = imageUrls;

        // console.log(req.images);

        next();
      }
    } catch (err) {
      next(err);
    }
  },
);

export default uploadMultiple;
