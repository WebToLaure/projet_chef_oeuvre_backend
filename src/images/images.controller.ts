import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, UseGuards, UploadedFile, Res, NotFoundException, ParseIntPipe, StreamableFile } from '@nestjs/common';
import { Express } from 'express';
import { ImagesService } from './images.service';
import { fileFilter } from './config';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { TopicsService } from 'src/topics/topics.service';
import { createReadStream } from 'fs';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly topicsService: TopicsService
  ) { }





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




  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Affichage de l'ensemble des photos " })
  @ApiResponse({ status: 200, description: 'Affichage de vos photos réussi' })
  async findAll() {
    const AllImages = await this.imagesService.findAll();
    if (!AllImages) {
      throw new NotFoundException('aucune photo encore enregistrée')
    }
    return {
      status: 200,
      message: 'Voici vos photos',
      data: AllImages
    }
  }


  /* @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads' });
  }
 */


 /*  @UseGuards(JwtAuthGuard)
  @Get('file/:id')
  @ApiOperation({ summary: "Récupération d'un fichier " })
  @ApiResponse({ status: 200, description: 'Fichier téléchargé' })
  async getFile(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const image = await this.imagesService.findImageById(id); //Permet de trouver l'image
    const fileImage =image.map((item) => item.file); //permet d'utiliser le nom du fichier blob dans mon dossier Uploads de mon back
    const file = createReadStream(join(process.cwd(), `uploads/${fileImage}`)); //Permet de créer le chemin du d'accès du fichier .
    const result = new StreamableFile(file); //renvoi le fichier pour l'utiliser

    return result;
  } */



  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: "Recherche d'une photo par son id" })
  @ApiResponse({ status: 200, description: 'Voici le résultat de votre recherche' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.imagesService.findImageById(id);
    if (!response) {
      throw new NotFoundException("La photo recherchée n'existe pas.");
    }
    return {
      status: 200,
      message: 'Voici le résultat de votre recherche',
      data: response,
    };
  }



  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: "Modification d'une photo " })
  @ApiResponse({ status: 200, description: 'Votre photo a bien été modifiée' })
  async updateImage(@Param('id',ParseIntPipe) id: number, @Body() updateImageDto: UpdateImageDto) {
    const findImage = await this.imagesService.findImageById(id);
    if (!findImage) {
      throw new NotFoundException(`La photo n'existe pas `);
    }
    const response = await this.imagesService.updateImage(id, updateImageDto);
    return {
      status: 200,
      message: 'La modification de votre photo a bien été prise en compte',
      data: response,
    };
  }



  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'une photo " })
  @ApiResponse({ status: 200, description: 'Photo supprimée avec succès' })
  async removeImage(@Param('id', ParseIntPipe) id: number) {
    const response = await this.imagesService.findImageById(id);
    if (!response) {
      throw new NotFoundException("Cette photo n'existe pas ou plus");
    }
    const photoDel = await this.imagesService.remove(id);
    return {
      status: 200,
      message: `Votre photo a bien été supprimée`,
      data: response,
    };
  }
}
