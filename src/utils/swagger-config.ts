/* eslint-disable prettier/prettier */
import { DocumentBuilder } from '@nestjs/swagger';

export const swagger_config = new DocumentBuilder()
  .setTitle("Документация по веб-сервису для приложения библиотеки")
  .setDescription(`Добро пожаловать в документацию по веб-сервисам нашей библиотеки. Ниже вы найдете полный список различных доступных API, а также шаблоны, используемые в нашем приложении. Подробные сведения о входах и выходах каждого API также включены, чтобы облегчить вашу интеграцию.
  
  Если у вас возникнут вопросы или потребуется дополнительная помощь, пожалуйста, обращайтесь к нам по адресу https://atoundji.com.
  `)
  .setVersion("1.0")
  .addTag("cast")
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'token',)
  .build();