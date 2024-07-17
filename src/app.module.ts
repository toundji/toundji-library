import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { baseOrmConfig } from './database/base_orm_config';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { UserController } from './controlers/user.controller';
import { UserService } from './services/user.service';
import { BookService } from './services/book.service';
import { BookController } from './controlers/book.controler';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthGuard, RoleGuard, UserAuditInterceptor, UserAuditSubscriber } from './utils/api-util';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';


@Module({
  imports: [


    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          // secure: process.env.NODE_ENV == "PROD" ? true : false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),


    TypeOrmModule.forRoot(baseOrmConfig),

    TypeOrmModule.forFeature([
      User, Book
    ]),


    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN, },
    }),

    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),

    ConfigModule.forRoot({ isGlobal: true }),

  ],
  controllers: [AppController, UserController, BookController],
  providers: [AppService, UserService, BookService,
    UserAuditSubscriber,

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserAuditInterceptor,
    },
  ],
})
export class AppModule { }
