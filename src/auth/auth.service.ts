import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {

    constructor
        (private usersService: UsersService,
            private jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);

        if (user === null) {
            throw new NotFoundException("cet email n'exite pas")
        }
        const encodePassword = await bcrypt.compare(password, user.password)//compare password hashe avec celui du user

        if (user && encodePassword) {// remplace user.password avec le nom de la const de hashage
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user: User) {
        const targetUser = await this.usersService.findUserByEmail(user.email);

        const payload = { email: targetUser.email, sub: targetUser.id };

        return {
            user: targetUser,
            access_token: this.jwtService.sign(payload),
        }
    }

}
