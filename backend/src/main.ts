import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformResponseInterceptor } from './config/transform-response.interceptor';
import { HttpExceptionFilter } from './config/http-exception.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(bodyParser.json({ limit: '50mb' }));
  // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // app.enableCors({
  //   origin: true,
  //   credentials: true,
  // });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 6000);
}
bootstrap();
