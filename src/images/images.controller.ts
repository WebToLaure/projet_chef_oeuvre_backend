import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, UseGuards, UploadedFile, Res } from '@nestjs/common';
import { Express } from 'express';
import { ImagesService } from './images.service';
import { fileFilter } from '../config';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }


  @UseGuards(JwtAuthGuard)
  @Post('uploads')
  @ApiOperation({ summary: "Ajout d'un fichier " })
  @ApiResponse({ status: 201, description: 'Fichier téléchargé' })

  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({  //fonction utilisable avec multer retourne un moteur de stockage implémenté pour stocker les photos en local.
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); //retourne un numéro multer propre à chaque photo
        const ext = extname(file.originalname); //extension du fichier original
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      }
    }),
    fileFilter: fileFilter,
  }))

  async uploadFile(@Body() @UploadedFile() file: Express.Multer.File) { //@Body()createImageDto :CreateImageDto,
    console.log(file);
    this.imagesService.create({
    file:file.filename
    
    })

    return {
      statusCode: 201,
      data: file,
      message: "Votre photo a bien été ajoutée"
    };


  }


 

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads' });
  }


  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
