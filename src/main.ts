import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Libera o acesso à API a partir de outras origens (ex.: Live Server na porta 5500)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Aula 8: serve o front-end (HTML, CSS e JS) que está em src/public
  // Acesse http://localhost:3000 para abrir o app.
  app.useStaticAssets(join(process.cwd(), 'src', 'public'));

  await app.listen(3000);
  console.log('App rodando em http://localhost:3000');
}
bootstrap();
