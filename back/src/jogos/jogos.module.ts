import { Global, Module } from '@nestjs/common';
import { JogosController } from './jogos.controller' 
import { JogosService } from './jogos.service'
import { PrismaModule } from 'src/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [JogosController],
    providers: [JogosService,]
})
export class JogosModule {}
