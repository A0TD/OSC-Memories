import multer from "multer"
import path from "path"
import { Request } from "express";


const storage = multer.diskStorage({
    filename: (req:Request , file:any , cb:any)=>{
         cb(null , Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

export default upload;