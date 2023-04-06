import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';



/**
 * Ensemble des services pour la table User:
 * 
 * * **create**           : permet de créer un user dans la BDD.
 * * **findUserByEmail**  : permet de récupérer un user de la BDD par son mail
 * * **finAll**           : permet de récupérer tous les users de la BDD
 * * **findOne**          : permet de récupérer un user de la BDD par son id
 * * **update**           : permet de modifier un user de la BDD par son id
 * * **remove**           : permet de supprimer un user de la BDD par son id */
@Injectable()
//Class permettant la gestion des requètes SQL pour les compétences
export class UsersService {

// Trouver un user dans la BDD par son email
async findUserByEmail(email: string){

  return await User.findOneBy({ email });
}

//Trouver un user par son pseudo
async findByPseudo(pseudo:string){

  return await User.findOneBy({pseudo})
}


  // Créer un user dans la BDD
  async register(createUserDto: CreateUserDto){

    const user = await User.create({...createUserDto }).save();
    delete user.password;
    return user;
  }

  // Trouver tous les users dans la BDD ADMIN UNIQUEMENT
  async findAll(){

    const users = await User.find();
    return users;
  }


  // Trouver un user dans la BDD par son id
  async findUserById(id: number){

    const user = await User.findOneBy({ id })

    if (user)
    {
      return user;
    }
    return undefined;
  }


  // Modifier un user dans la BDD par son id
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null>{

    const updatedUser = await User.findOneBy({id});
    updatedUser.gender = updateUserDto.gender,
    updatedUser.pseudo = updateUserDto.pseudo,
    updatedUser.password = updateUserDto.password,

    await User.save(updatedUser);

    return updatedUser
  }

// Supprimer un user dans la BDD par son id
  async remove(id: number | any) {
    const user = await User.remove(id);

    if (user) {
      return user;
    }
    return undefined
  }
}
