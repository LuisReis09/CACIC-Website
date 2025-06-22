import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessoresModule } from './professores/professores.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JogosService } from './jogos/jogos.service';
import { JogosController } from './jogos/jogos.controller';
import { JogosModule } from './jogos/jogos.module';
import { AluguelModule } from './aluguel/aluguel.module';
import { MonitoriasModule } from './monitorias/monitorias.module';
import { GruposModule } from './grupos/grupos.module';

@Module({
  imports: [ProfessoresModule, AuthModule, UsersModule, JogosModule, AluguelModule, MonitoriasModule, GruposModule],
  controllers: [AppController, JogosController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JogosService,
  ],
})
export class AppModule {}
