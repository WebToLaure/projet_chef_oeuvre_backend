import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic} from './entities/topic.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateDateColumn } from 'typeorm';

@Injectable()

/**@class TopicsService
 * 
 * * Méthodes liées aux requêtes client. Fournisseur du controleur
 * * Méthode permettant de recevoir les données de la source de données,appliquer la logique métier et renvoyer la réponse au controleur.
 * * Création de topics, Recherche via des critères, Modifification des données, Suppression d'un topic.
 */
export class TopicsService {

  /*  * 
 * @method createTopic :
 * Method permettant de créer une topic suivant le modèle du CreateTopicDto.
 */
  async createTopic(createTopicDto: CreateTopicDto, user: User) {
    const response = Topic.create({ ...createTopicDto})
    delete user.password;
    response.user = user;
    return await response.save();
  }


  /** 
    * @method findAll:
    * * Methode permettant de rechercher TOUS les topics (role admin).
    */
  async findAll(): Promise<Topic[]> {
    return await Topic.find();
  }



  /** 
  * @method findTopicById :
  * * Methode permettant de rechercher un topic par SON id .
  */
  async findTopicById(id: number) {
    const response = await Topic.findOne({ relations: { user: true }, where: { id } })
    if (!response) {
      return undefined;
    }
    return response;
  }



  /** 
  * @method updateTopic :
  * * Methode permettant de modifier un topic par son auteur.
  */
  async updateTopic(id: number, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const response = await Topic.findOneBy({ id }); // const permettant de retrouver le topic par son id
    response.continent = updateTopicDto.continent;
    response.title= updateTopicDto.title;
    response.destinations = updateTopicDto.destinations;
    response.content=updateTopicDto.content;// response.content = actuel ; updateTopicDto.content = nouveau topic
    await response.save() // sauvegarde du nouveau topic
    return response;
  }



  /** 
  * @method deleteTopic :
  * * Methode permettant de supprimer un topic par son auteur.
  */
  async deleteTopic(id: number) {
    const deletedTopic = await Topic.findOneBy({id});
    deletedTopic.remove();
    if (deletedTopic){
      return deletedTopic
    }
    return undefined
  }



  /** 
  * @method findByTopicAndUser:
  * * Methode permettant de retourner les données d'une relation user et topic.
  */
  async findTopicAndUser(userId: number, title: string) {
    return await Topic.findOne({ where: { user: { id: userId }, title: title } });
  }

}
