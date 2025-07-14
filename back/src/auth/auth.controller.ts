import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

export class RegisterDto {
  login: string;
  senha: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiResponse({ status: 200, example: { username: 'john' } })
  getProfile(@Request() req) {
    return req.user;
  }

  // Rota para testar se o token advindo do Authorization, no Header, é válido
  @Public()
  @Get('validar')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Token válido' })
  async validarToken(@Request() req) {
    return await this.authService.validarToken(req);
  }

}
