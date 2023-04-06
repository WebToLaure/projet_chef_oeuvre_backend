import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/enum/roles.decorator';
import { Role } from 'src/enum/role.enum';


/**@class TopicsController
* 
* * Méthode chargée d'invoquer le service topics.
* * Contrôle des requêtes entrantes , Vérification avant envoi en base de données, invoque le service.
* * Création, Recherche via certains critères, Modifification des données , Suppression d'un topic.
*/
@ApiTags('TOPICS')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService,
    private readonly usersService: UsersService) { }

  /** Création d'un topic
    * @method createTopic:
    * * Contrôle des données sur la création  d'un topic.
    * * Envoi d'un message correspondant au résultat de la requête.
  */
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateTopicDto })
  @ApiOperation({ summary: "Ajout d'un Topic " })
  @ApiResponse({ status: 201, description: 'Topic posté' })
  @Post('new')
  async createTopic(@Body() createTopicDto: CreateTopicDto, @Request() req) {

    const newComment = this.topicsService.createTopic(createTopicDto, req.user);

    if (await this.topicsService.findTopicAndUser(req.user, createTopicDto.title)) {

      throw new HttpException("Ce topic existe déjà.", HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findUserById(req.user.id)
    const response = await this.topicsService.createTopic(createTopicDto, user);
    return {
      statusCode: 201,
      data: response,
      message: "Votre Topic a bien été publié"
    }
  }



  /** 
     * @method findAll:
     * * Contrôle des données sur la recherche de tous les topics utilisateurs.
     * * Envoi d'un message correspondant au résultat de la requête.
     */
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Recherche de l'ensemble des topics" })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les topics postés',
  })
  @Get()
  async findAll() {
    const response = await this.topicsService.findAll();
    if (!response) {
      throw new HttpException("aucun topic n'a été trouvé", HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: 200,
      data: response,
      message: "Liste de tous les topics"
    }
  }



  /** 
    * @method findTopicByUserId:
    * * Contrôle des données sur la recherche des topics par l'id de l'utilisateur( admin).
    * * Envoi d'un message correspondant au résultat de la requête.
    */
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Recherche de l'ensemble des topics d'un user" })
  @ApiResponse({ status: 200, description: 'Voici les topics de ${user.pseudo}' })
  @Get('user/:id')
  async findCommByUserId(@Param('id') id: string, @Request() req) {
    const response = await this.usersService.findUserById(+id);
    if (!response) {
      throw new HttpException("cet utilisateur n'existe pas", HttpStatus.NOT_FOUND);
    }

    const TopicAndUser = await this.topicsService.findAll();

    return {
      message: `Voici les topics du user n°${id}`,
      data: TopicAndUser,
    };
  }


  /** 
  * @method findTopicById:
  * * Contrôle des données sur la recherche d'un topic par son id .
  * * Envoi d'un message correspondant au résultat de la requête.
  */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: "Recherche d'un topic par id" })
  @ApiResponse({ status: 200, description: 'Votre topic a été trouvé' })
  async findTopicById(@Param('id', ParseIntPipe) id: number) {
    const response = await this.topicsService.findTopicById(id);
    if (!response) {
      throw new HttpException("Aucun topic de trouvé", HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: 200,
      data: response,
      message: "Affichage du topic correspondant à votre recherche"
    }
  }


  /** Modification d'un topic
        * @method updateTopic:
        * * Contrôle des données sur la recherche d'un topic utilisateur.
        * * Envoi d'un message correspondant au résultat de la requête.
        */
  @ApiBody({ type: UpdateTopicDto })
  @ApiOperation({ summary: "Modification d'un topic par son auteur" })
  @ApiResponse({ status: 200, description: 'Votre topic a bien été modifié' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateComm(@Param('id', ParseIntPipe) id: number, @Body() updateTopicDto: UpdateTopicDto, @Request() req) {
    const topic = await this.topicsService.findTopicById(+id);
    if (!topic) {
      throw new HttpException("Commentaire introuvable.", HttpStatus.NOT_FOUND);
    }
    if (topic.user.id !== req.user.userId) {
      throw new HttpException("Non autorisé.", HttpStatus.FORBIDDEN);
    }
    const response = await this.topicsService.updateTopic(id, updateTopicDto);
    return {
      statusCode: 200,
      data: response,
      message: "Les modifications du topic ont bien été prises en compte"
    }
  }


  /** Suppression d'un topic par son auteur
   * @method remove:
   * * Contrôle des données sur la suppression d'un topic utilisateur.
   * * Envoi d'un message correspondant au résultat envoyé par la BDD, de la requête utilisateur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'un topic par son auteur" })
  @ApiResponse({ status: 200, description: 'Topic supprimé' })
  async remove(@Param('id', ParseIntPipe) id: string, @Request() req) {
    const findTopic = await this.topicsService.findTopicById(+id);
    if (findTopic === null) {
      throw new NotFoundException("Ce topic n'existe pas");
    }
    if (req.user.userId !== findTopic.user.id) {

      throw new ForbiddenException("Vous ne pouvez pas supprimer ce topic, merci de contacter votre administarteur");
    }
    const deleteTopic = await this.topicsService.deleteTopic(+id);
    if (deleteTopic === null) {
      throw new NotFoundException();
    }
    return {
      codeStatus: 200,
      message: `Topic n°${id} supprimé`,
      data: deleteTopic,
    };
  }
}




