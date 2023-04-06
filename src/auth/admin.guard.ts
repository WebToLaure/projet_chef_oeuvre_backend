import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role} from 'src/enum/role.enum';
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = [Role.ADMIN];
        const user = context.switchToHttp().getRequest().user as User;
        return requiredRoles.includes(user.role);
    }
}