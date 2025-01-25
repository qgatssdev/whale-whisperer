import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cors from 'cors';
import { Config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = '/api';

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cors());

  const port = Config.PORT || 3000;
  await app.listen(port);
}
bootstrap();
