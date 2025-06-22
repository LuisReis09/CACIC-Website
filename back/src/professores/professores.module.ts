import { Module } from '@nestjs/common';
import { ProfessoresController } from './professores.controller';
import { ProfessoresService } from './professores.service';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'src/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [ProfessoresController],
  providers: [ProfessoresService],
})
export class ProfessoresModule {}
