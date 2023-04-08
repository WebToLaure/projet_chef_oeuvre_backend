import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Request, ClassSerializerInterceptor, UseInterceptors, BadRequestException, UseGuards, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';



@ApiTags('USERS') //donne un titre pour swagger
@UseInterceptors(ClassSerializerInterceptor) // décorateur qui intercepte les "Exclude" prévus dans les entities pour interdire leur affichage
@Controller('users')  //segment dynamique qui apparaîtra dans l'URL
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  
  @Post('register')
  @ApiOperation({ summary: "Création d'un compte utilisateur" })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async register(@Body() createUserDto: CreateUserDto) {

    const ExistingMail = await this.usersService.findUserByEmail(createUserDto.email);
    if (ExistingMail) {
      throw new HttpException("l'email existe déjà", HttpStatus.NOT_ACCEPTABLE);
    }

    const PseudoExists = await this.usersService.findByPseudo(createUserDto.pseudo)

    if (PseudoExists) {

      throw new HttpException("le pseudo existe déjà", HttpStatus.NOT_ACCEPTABLE);
    }
    if (createUserDto.password !== createUserDto.password_confirm) {

      throw new ConflictException("Erreur sur saisie mot de passe")

    }

    createUserDto.password = await encodePassword(createUserDto.password) //crypte le mot de passe

    const newAccount = await this.usersService.register(createUserDto); //création du nouvel utilisateur

    return {
      statusCode: 201,
      message: `${createUserDto.pseudo} a bien été créé`,
      data: newAccount
    }
  }

  @UseGuards(JwtAuthGuard) //permet d'afficher tous les utilisateurs pour l'admin
  @Get()
  @ApiOperation({ summary: `Affichage de tous les users` })
  async findAll() {
    const allUsers = await this.usersService.findAll();
    return {
      statusCode: 200,
      message: "Récupération réussie de tous les users",
      data: allUsers
    };
  }

  @Get(':id')
  @ApiOperation({ summary: `Récupération d'un user par son id` })
  async findOne(@Param('id') id: number) {
    const oneUser = await this.usersService.findUserById(id);
    if (!oneUser) {
      throw new BadRequestException('User non trouvé')
    }
    return {
      statusCode: 200,
      message: `Récupération réussie du user ${id}`,
      data: oneUser
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: ` Modification d'un user` })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {

    const account = req.user.id

    const updatedUser = await this.usersService.update(account, updateUserDto);

    if (!updatedUser) {
      throw new HttpException('Erreur Serveur', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      statusCode: 201,
      message: 'Modifcations prises en compte',
      data: updatedUser
    };
  }


  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: ` Modification d'un user par son id` })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {

    const isUserExists = await this.usersService.findUserById(id);
    if (!isUserExists) {
      throw new NotFoundException("L'utilisateur n'existe pas");
    }

    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException('Erreur Serveur', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      statusCode: 201,
      message: "Les modifications ont été prises en compte",
      data: updatedUser
    }
  }

  // Suppression de son propre compte
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Supprimer un compte utilisateur' })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  @Delete()
  @ApiProperty()
  async removeUser(@Request() req) {
    const account = req.user.id

    const user = await this.usersService.findUserById(account);
    if (!user) {
      throw new HttpException(`Ce compte utilisateur n'existe pas`, HttpStatus.NOT_FOUND);
    }
    const deletedUser = await this.usersService.remove(user);
    if (!deletedUser) {
      throw new HttpException('Erreur Serveur', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      statusCode: 201,
      message: "Votre demande de suppression a bien été prise en compte",
      data: deletedUser
    };
  }

  // Suppression d'un user par son id pour l'admin
  @ApiOperation({ summary: `suppression d'un compte utilisateur par son id` })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isUserExists = await this.usersService.findUserById(+id);
    if (!isUserExists) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    const deletedUser = await isUserExists.remove();
    if (!deletedUser) {
      throw new HttpException('Erreur Serveur', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      statusCode: 201,
      message: 'Suppression de votre compte utilisateur',
      data: deletedUser
    }
  }
}
