import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe, NotFoundException, ForbiddenException, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
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
@UseInterceptors(ClassSerializerInterceptor)
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
    console.log(createTopicDto, "test");
    const topicExists = await this.topicsService.findTopicAndUser(req.user.id, createTopicDto.continent);

    if (topicExists) {

      throw new HttpException("Ce topic existe déjà.", HttpStatus.BAD_REQUEST);
    }

    const response = await this.topicsService.createTopic(createTopicDto, req.user);
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
      throw new HttpException("Topic introuvable.", HttpStatus.NOT_FOUND);
    }
    if (topic.user.id !== req.user.id) {
      throw new HttpException("Vous n'êtes pas autorisé à modififier ce topic, merci de contacter votre administrateur.", HttpStatus.FORBIDDEN);
    }
    const response = await this.topicsService.updateTopic(id, updateTopicDto);
    return {
      statusCode: 200,
      data: response,
      message: `Les modifications de votre topic "${topic.destinations}"ont bien été prises en compte`
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
    if (!findTopic) {
      throw new NotFoundException("Ce topic n'existe pas");
    }
    if (findTopic.user.id!== req.user.id ) {

      throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer ce topic, merci de contacter votre administarteur");
    }
    const deleteTopic = await this.topicsService.deleteTopic(+id);
    
    return {
      codeStatus: 200,
      message: `Topic n°${id} supprimé`,
      data: deleteTopic,
    };
  }
}




