import cloudinary from "../config/cloduinary.config.js"
import asyncHandler from "express-async-handler"
import { Request , Response , NextFunction } from "express";


const uploadMultiple = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const images:any = req.files;
    console.log(images);
    const imageUrls = [];

    for(const image of images){

        const result = await cloudinary.uploader.upload(image.path);

        imageUrls.push(result.secure_url);
       
        //we need here to make images interface to extend Request type
        req.images = imageUrls;

        // console.log(req.images);

        next();
    }
       
  } catch (err) {
      console.error(err);
    res.status(500).send(`Internal server error -${err}`);
  }
});

export default uploadMultiple;