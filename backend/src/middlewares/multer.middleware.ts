import multer from "multer"
import path from "path"
import { Request } from "express";


const storage = multer.diskStorage({
    filename: (req:Request , file , callback)=>{
         callback(null , Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

export default upload;