import { extname } from "path";
import { diskStorage } from "multer";
import { HttpException, HttpStatus } from '@nestjs/common';


export const fileFilter = (req: any, file: any, callback: any) => {

    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {

        callback(null, true);

    } else {

        callback(new HttpException(`type de fichier non supporté ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false)
    }
}

/* limits:{

       fileSize:+process.env.MAX_FILE_SIZE,
   }, */
