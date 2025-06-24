import { Module } from '@nestjs/common';
import { AluguelController } from './aluguel.controller';
import { AluguelService } from './aluguel.service';
import { PrismaModule } from 'src/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [AluguelController],
  providers: [AluguelService]
})
export class AluguelModule {}
