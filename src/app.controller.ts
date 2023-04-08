import { Controller, Request, Get, Post, UseGuards,ClassSerializerInterceptor,UseInterceptors } from '@nestjs/common';
import { ApiTags,ApiOperation,ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
 
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }
 
  @ApiTags('Log In')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Connexion au compte utilisateur existant" })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('auth/login') //a verifier
  async login(@Request() req: any) {
    return this.authService.login(req.body);

  }

  @ApiTags('Profil Utilisateur')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
