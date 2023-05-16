import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Injectable()
export class ImagesService {
  async create(topicBelonging: Topic, file: Express.Multer.File) {
    console.log(file);
    
    //const response = new Image() //Image.create({ ...createImageDto });
    const addNewImage = new Image();
    addNewImage.file = file.filename;
    addNewImage.originalName = file.originalname;
    addNewImage.topic = topicBelonging;
    //response.topic = topicBelonging;
    await addNewImage.save();
    return addNewImage;
  }


  /*  async create(
     createPhotoDto: CreateImageDto,file: Express.Multer.File): Promise<Image | undefined> {
     const response = await Image.create({...createImageDto});
     const newPhoto = new Image();
     newPhoto.file = file.filename;
     newPhoto.originalName = file.originalname;
     newPhoto.mimeType = file.mimetype;
     await Image.save(newPhoto);
     return newPhoto;
   } */
  async findAll(): Promise<Image[] | undefined> {
    const allPhoto = await Image.find();
    return allPhoto;
  }
  async findImageById(id: number): Promise<Image[] | undefined> {
    const onePhoto = await Image.find({ where: { id: id } });
    return onePhoto;
  }

  /** 
  * @method updateImage :
  * * Methode permettant de modifier une photo.
  */
  //async updateImage(id: number, updateImageDto: UpdateImageDto) //: Promise<Image> {
    // const response = await Image.findOneBy({ id }); // const permettant de retrouver la photo par son id
   // response.file = updateImageDto.file;
   // await response.save() // sauvegarde de la nouvelle photo
   // return response; 
  


  /** 
  * @method deleteImage :
  * * Methode permettant de supprimer une image de son topic.
  */
  async remove(id: number) {
    const deletedImage = await Image.findOneBy({ id });
    deletedImage.remove();
    if (deletedImage) {
      return deletedImage
    }
    return undefined
  }
}
