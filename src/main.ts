import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { errorMapper } from './utils/api-error';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import { SwaggerModule } from '@nestjs/swagger';
import { swagger_config } from './utils/swagger-config';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');



  app.useGlobalPipes(new ValidationPipe({ exceptionFactory: errorMapper }));
  app.enableCors({ origin: true });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


  app.use(express.static(path.join(process.cwd(), '../public')));

  app.use('/public', express.static(path.join(__dirname, '../public')));

  const document = SwaggerModule.createDocument(app, swagger_config);


  SwaggerModule.setup('/docs', app, document);



  writeFileSync('./swagger.json', JSON.stringify(document));



  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

bootstrap();
