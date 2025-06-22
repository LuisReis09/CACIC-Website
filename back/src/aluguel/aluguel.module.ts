import { Module } from '@nestjs/common';
import { AluguelController } from './aluguel.controller';
import { AluguelService } from './aluguel.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AluguelController],
  providers: [AluguelService]
})
export class AluguelModule {}
