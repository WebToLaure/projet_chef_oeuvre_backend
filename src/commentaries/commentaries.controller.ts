import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { CommentariesService } from './commentaries.service';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';
import { TopicsService } from 'src/topics/topics.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/enum/roles.decorator';
import { Role } from 'src/enum/role.enum';

/**@class CommentariesController
* 
* * Méthode chargée d'invoquer le service commentaires.
* * Contrôle des requêtes entrantes et sortantes côté client.Vérification avant d'invoquer le service, pour envoi au service et réception du service (son fournisseur).
* * Création, Recherche via certains critères, Modifification des données , Suppression d'un commentaire.
*/
@ApiTags('COMMENTAIRES')
@Controller('commentaries')
export class CommentariesController {
  constructor(private readonly commentariesService: CommentariesService,
    ) { }

  /** Création d'un commentaire
    * @method create:
    * * Contrôle des données sur la création  d'un commentaire utilisateur.
    * * Envoi d'un message correspondant au résultat de la requête.
  */
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateCommentaryDto })
  @ApiOperation({ summary: "Ajout d'un commentaire sur topic" })
  @ApiResponse({ status: 201, description: 'Commentaire posté' })
  @Post()

  async create(@Body() createCommentaryDto: CreateCommentaryDto, @Request() req) {
    const newComment = this.commentariesService.create(createCommentaryDto, req.user);
    return {
      statusCode: 201,
      data: newComment,
      message: `${newComment} a bien été ajouté`
    }
  };


  /** 
      * @method findAll:
      * * Contrôle des données sur la recherche de tous les commentaires utilisateurs.
      * * Envoi d'un message correspondant au résultat de la requête.
      */
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Recherche de l'ensemble des commentaires" })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les commentaires',
  })
  @Get()
  async findAll() {
    const response = await this.commentariesService.findAll();
    if (!response) {
      throw new HttpException("aucun commentaire trouvé", HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: 200,
      data: response,
      message: "Liste de tous les commentaires"
    }
  }


  /** 
    * @method findCommByUserId:
    * * Contrôle des données sur la recherche des commentaires par l'id de l'utilisateur( admin).
    * * Envoi d'un message correspondant au résultat de la requête.
    */
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Recherche de l'ensemble des commentaires d'un user" })
  @ApiResponse({ status: 200, description: 'Voici les commentaires de ${user.pseudo}' })
  @Get('user/:id')
  async findCommByUserId(@Param('id') id: string, @Request() req) {
    const response = await this.commentariesService.findByUserId(+id);
    if (response === null) {
      throw new HttpException("aucun commentaire trouvé", HttpStatus.NOT_FOUND);
    }
    return {
      message: `Voici les commentaires du user n°${id}`,
      data: response,
    };
  }


  /** 
  * @method findCommById:
  * * Contrôle des données sur la recherche d'un commentaire par son id .
  * * Envoi d'un message correspondant au résultat de la requête.
  */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: "Recherche d'un commentaire par id" })
  @ApiResponse({ status: 200, description: 'Votre commentaire a été trouvé' })
  async findCommById(@Param('id', ParseIntPipe) id: number) {
    const response = await this.commentariesService.findCommentById(id);
    if (!response) {
      throw new HttpException("Aucun commentaire trouvé", HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: 200,
      data: response,
      message: "Affichage du commentaire correspondant à votre recherche"
    }
  }


  /** Modification d'un commentaire
        * @method updateComm:
        * * Contrôle des données sur la recherche d'un commentaire utilisateur.
        * * Envoi d'un message correspondant au résultat de la requête.
        */
  @ApiBody({ type: UpdateCommentaryDto })
  @ApiOperation({ summary: "Modification d'un commentaire par son auteur" })
  @ApiResponse({ status: 200, description: 'Votre commentaire a été modifié' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateComm(@Param('id', ParseIntPipe) id: number, @Body() updateCommentaryDto: UpdateCommentaryDto, @Request() req) {
    const commentary = await this.commentariesService.findCommentById(+id);
    if (!commentary) {
      throw new HttpException("Commentaire introuvable.", HttpStatus.NOT_FOUND);
    }
    if (commentary.user.id !== req.user.userId) {
      throw new HttpException("Non autorisé.", HttpStatus.FORBIDDEN);
    }
    const response = await this.commentariesService.updateCommentary(id, updateCommentaryDto);
    return {
      statusCode: 200,
      data: response,
      message: "Les modifications du commentaire ont bien été prises en compte"
    }
  }


  /** Suppression d'un commentaire par son auteur
   * @method remove:
   * * Contrôle des données sur la suppression d'un commentaire utilisateur.
   * * Envoi d'un message correspondant au résultat envoyé par la BDD de la requête utilisateur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'un commentaire par son auteur" })
  @ApiResponse({ status: 200, description: 'Commentaire supprimé' })
  async remove(@Param('id', ParseIntPipe) id: string, @Request() req) {
    const findComment = await this.commentariesService.findOne(+id);
    if (findComment === null) {
      throw new NotFoundException("Ce commentaire n'existe pas");
    }
    if (req.user.userId !== findComment.user.id) {

      throw new ForbiddenException("Vous ne pouvez pas supprimer ce commentaire, merci de contacter votre administarteur");
    }
    const deleteComment = await this.commentariesService.deleteCommentary(+id);
    if (deleteComment === null) {
      throw new NotFoundException();
    }
    return {
      codeStatus: 200,
      message: `Commentaire n°${id} supprimé`,
      data: deleteComment,
    };
  }
}




