import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe,Request, NotFoundException } from '@nestjs/common';
import { ContinentsService } from './continents.service';
import { CreateContinentDto } from './dto/create-continent.dto';
import { UpdateContinentDto } from './dto/update-continent.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBody, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/admin.guard';
@ApiTags('CONTINENTS')
@Controller('continents')
export class ContinentsController {
  constructor(private readonly continentsService: ContinentsService) { }



  /** Création d'un continent
    * @method createContinent:
    * * Contrôle des données sur la création  d'un continent.
    * * Envoi d'un message correspondant au résultat de la requête.
  */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBody({ type: CreateContinentDto })
  @ApiOperation({ summary: "Ajout d'un Continent" })
  @ApiResponse({ status: 201, description: 'Continent ajouté' })
  @Post()
  async createContinent(@Body() createContinentDto: CreateContinentDto) {

    const continentExists = await this.continentsService.findContinentByName(createContinentDto.continent);
    if (continentExists) {
      throw new HttpException("Ce continent a déjà été ajouté.", HttpStatus.BAD_REQUEST);
    }
    const response = await this.continentsService.createContinent(createContinentDto);
    return {
      statusCode: 201,
      data: response,
      message: "Le continent a bien été ajouté"
    }
  }



    /** 
    * @method findAll:
    * * Contrôle des données sur la recherche des continents existants en BDD.
    * * Envoi d'un message correspondant au résultat de la requête.
    */
  @ApiOperation({ summary: "Recherche de l'ensemble des continents" })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les continents existants',
  })
  @Get()
  async findAll() {
    const response = await this.continentsService.findAll();
    if (!response) {
      throw new HttpException("aucun continent n'a été trouvé", HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: 200,
      data: response,
      message: "Liste de tous les continents"
    }
  }



  /** 
  * @method findContinentById:
  * * Contrôle des données sur la recherche d'un continent par son id .
  * * Envoi d'un message correspondant au résultat de la requête.
  */
  @Get(':id')
  @ApiOperation({ summary: "Recherche d'un continent par id" })
  @ApiResponse({ status: 200, description: 'Continent correspondant' })
  async findContinentById(@Param('id', ParseIntPipe) id: number) {
    const response = await this.continentsService.findContinentById(id);
    if (!response) {
      throw new HttpException("Aucun continent trouvé", HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: 200,
      data: response,
      message: "Affichage du continent correspondant"
    }
  }



  /** Modification d'un continent
  * @method updateContinent:
  * * Contrôle des données sur la recherche d'un continent.
  * * Envoi d'un message correspondant au résultat de la requête.
  */
  @ApiBody({ type: UpdateContinentDto })
  @ApiOperation({summary:"Modifier le nom d'un continent (ADMIN)"})
  @ApiResponse({status:200, description:'nom du continent modifié'})
  @UseGuards(JwtAuthGuard,AdminGuard)
  @Patch(':id')
  async updateContinent(@Param('id', ParseIntPipe) id: number, @Body() updateContinentDto: UpdateContinentDto, @Request() req){
    const response = await this.continentsService.updateContinent(id,updateContinentDto);
    return{
      statusCode: 200,
      data: response,
      message: `La modification de nom du continent ${id} a bien été prise en compte`
      
    }
  }



  /** Suppression d'un continent.
   * @method remove:
   * * Contrôle des données sur la suppression d'un continent.
   * * Envoi d'un message correspondant au résultat envoyé par la BDD, de la requête ADMIN
   */
@UseGuards(JwtAuthGuard,AdminGuard)
@Delete(':id')
@ApiOperation({ summary: "Suppression d'un continent" })
@ApiResponse({ status: 200, description: 'Continent supprimé' })
async remove(@Param('id', ParseIntPipe) id: string, @Request() req) {
  const findContinent = await this.continentsService.findContinentById(+id);
  if (!findContinent) {
    throw new NotFoundException("Ce continent n'existe pas");
  }
  const deleteContinent = await this.continentsService.deleteContinent(+id);
  
  return {
    codeStatus: 200,
    message: `Continent n°${id} supprimé`,
    data: deleteContinent,
  };
}
}
