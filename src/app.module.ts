import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // lê o arquivo .env
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TransacoesModule,
  ],
})
export class AppModule {}
