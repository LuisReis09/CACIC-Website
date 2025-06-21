import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(login: string) {
    return this.prisma.admin.findUnique({
      where: { login },
    });
  }

  async createAdmin(data: { login: string; senha: string }) {
    return this.prisma.admin.create({
      data,
    });
  }
}
