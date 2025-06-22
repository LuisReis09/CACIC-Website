import { Module } from '@nestjs/common';
import { MonitoriasService } from './monitorias.service';
import { MonitoriasController } from './monitorias.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MonitoriasService],
  controllers: [MonitoriasController]
})
export class MonitoriasModule {}
