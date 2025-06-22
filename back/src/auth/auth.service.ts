import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  username: string;
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.register({
      login: 'cacic.ci',
      senha: '@Pravda2021',
    }).catch((error) => {
      ;
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Valida a senha usando bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { senha: _, ...result } = user; // Exclui a senha do retorno
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const payload: JwtPayload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }

  private async register(registerDto: any): Promise<any> {
    const { login, senha } = registerDto;

    // Verifica se o administrador já existe
    const existingAdmin = await this.usersService.findOne(login);
    if (existingAdmin) {
      throw new UnauthorizedException('Login already exists');
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Cria o administrador
    const newAdmin = await this.usersService.createAdmin({
      login,
      senha: hashedPassword,
    });

    return {
      message: 'Admin registered successfully',
      admin: { id: newAdmin.id, login: newAdmin.login },
    };
  }
}
