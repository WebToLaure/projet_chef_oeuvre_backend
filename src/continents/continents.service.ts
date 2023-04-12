import { Injectable } from '@nestjs/common';
import { CreateContinentDto } from './dto/create-continent.dto';
import { UpdateContinentDto } from './dto/update-continent.dto';
import { Continent } from './entities/continent.entity';

@Injectable()

/**@class ContinentssService
 * 
 * * Méthodes liées aux requêtes client. Fournisseur du controleur
 * * Méthode permettant de recevoir les données de la source de données,appliquer la logique métier et renvoyer la réponse au controleur.
 * * Création des continents, Recherche via des critères.
 */
export class ContinentsService {

  /*  * 
 * @method createTopic :
 * Method permettant de créer une topic suivant le modèle du CreateTopicDto.
 */
  async createContinent(createContinentDto: CreateContinentDto) {
    const response = Continent.create({ ...createContinentDto })
    return await response.save();
  }


  /** 
    * @method findAll:
    * * Methode permettant de rechercher TOUS les continents (role admin).
    */
  async findAll(): Promise<Continent[]> {
    return await Continent.find();
  }


  /** 
 * @method findContinentById :
 * * Methode permettant de rechercher un continent par SON id .
 */
  async findContinentById(id: number) {
    const response = await Continent.findBy({ id })
    if (!response) {
      return undefined;
    }
    return response;
  }


}
