import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessoresModule } from './professores/professores.module';

@Module({
  imports: [ProfessoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
