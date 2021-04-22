import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');

  const app = await NestFactory.create(AppModule);
  //Tell NestJs to use the Validation pipe in the entire application
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
}
bootstrap();
