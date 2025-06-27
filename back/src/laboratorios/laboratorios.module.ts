import { Module } from '@nestjs/common';
import { LaboratoriosController } from './laboratorios.controller';
import { LaboratoriosService } from './laboratorios.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LaboratoriosController],
  providers: [LaboratoriosService]
})
export class LaboratoriosModule {}
