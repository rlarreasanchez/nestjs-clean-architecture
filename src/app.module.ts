import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import * as Joi from "joi";

import { LoggerModule } from "@infrastructure/logger/logger.module";

import { TodosModule } from "@application/todos/todos.module";
import { AuthModule } from "@application/auth/auth.module";

import { TodosController } from "@presentation/http/todos/todos.controller";
import { AuthController } from "@presentation/http/auth/auth.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test")
          .required(),
        PORT: Joi.number().default(3000),
        DEBUG: Joi.boolean().default(false),
        PRISMA_SCHEMA: Joi.string().optional(),
        DATABASE_URL: Joi.string().required(),
        LDAP_SERVER: Joi.string().required(),
        LDAP_ACCOUNT_PREFIX: Joi.string().optional().allow(""),
        LDAP_ACCOUNT_SUFFIX: Joi.string().optional().allow(""),
        COOKIE_SECRET: Joi.string().required().min(32),
        SESSION_SECRET: Joi.string().required().min(32),
        SESSION_EXPIRES_IN_SECONDS: Joi.number().optional().default(3600),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
    TodosModule,
    AuthModule,
  ],
  controllers: [TodosController, AuthController],
  providers: [],
})
export class AppModule {}
