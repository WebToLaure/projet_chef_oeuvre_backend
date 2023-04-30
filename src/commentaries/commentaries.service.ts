import { Injectable } from '@nestjs/common';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';
import { User } from 'src/users/entities/user.entity';
import { Commentary } from './entities/commentary.entity';
import { IsNull } from 'typeorm';
import { Topic } from 'src/topics/entities/topic.entity';

@Injectable()

/**@class CommentairesService
 * 
 * * Méthodes liées aux requêtes client.
 * * Méthode permettant de recevoir les données de la source de données,appliquer la logique métier et renvoyer la réponse au controller.
 * * Création de compétences techniques, Recherche via des critères, Modifification des données, Suppression d'un commentaire.
 */
export class CommentariesService {

  /** 
* @method create :
* Method permettant de créer un commentaire suivant le modèle du CreatCommentaryDto.
*/
  async createCommentary(createCommentaryDto: CreateCommentaryDto, user: User, topic: Topic): Promise<Commentary> {
    const newCommentary = Commentary.create({ ...createCommentaryDto })
    delete user.password;
    newCommentary.user = user;
    newCommentary.topic = topic;
    await newCommentary.save()
    return newCommentary;
  }


  /** 
    * @method findAll:
    * * Methode permettant de rechercher TOUS les commentaires (role admin).
    */
  async findAll(): Promise<Commentary[]> {
    return await Commentary.find();
  }

  /** 
    * @method findOne:
    * * Methode permettant de rechercher un commentaire par son id .
    */
  async findOne(id: number): Promise<Commentary | null> {
    const response = await Commentary.findOne({
      relations: { topic: true, user: true },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        topic: { id: true, title: true },
        user: { pseudo: true },
      },
      where: { id: id, deletedAt: IsNull() },
    });
    if (response !== null) {
      return response;
    }
    return undefined;
  }


  async findByUserId(id: number): Promise<Commentary[] | null> {
    const commentaries = await Commentary.find({
      relations: { user: true, topic: true },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        topic: { id: true, title: true },
        user: { pseudo: true },
      },
      where: { user: { id: id }, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return commentaries;
  }

  /** 
  * @method findCommentById :
  * * Methode permettant de rechercher un commentaire par SON id .
  */
  async findCommentById(id: number) {
    const response = await Commentary.findOne({ relations: { user: true }, where: { id } })
    if (!response) {
      return undefined;
    }
    return response;
  }


  /** 
  * @method updateCommentary :
  * * Methode permettant de modifier un commentaire par son auteur.
  */
  async updateCommentary(id: number, updateCommentaryDto: UpdateCommentaryDto, user: User, topic: Topic): Promise<Commentary> {

    const response = await Commentary.findOneBy({ id }); // const permettant de retrouver le commentaire par son id

    response.content = updateCommentaryDto.content;
    response.topic = topic; // response.content = actuel ; updateCommentaryDto.content = nouveau commentaire
    await response.save() // sauvegarde du nouveau commentaire 
    return response;
  }


  /** 
  * @method deleteCommentary :
  * * Methode permettant de supprimer un commentaire par son auteur.
  */
  async deleteCommentary(id: number) {
    return await Commentary.delete({ id })
  }





  /** 
  * @method findByCommentaryAndUser:
  * * Methode permettant de retourner les données d'une relation user et commentaire.
  */
  async findCommentaryAndUser(userId: number, content: string) {
    return await Commentary.findOne({ where: { user: { id: userId }, content: content } });
  }

}
