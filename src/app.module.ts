import { Module } from "@nestjs/common";

import * as Joi from "joi";

import { LoggerModule } from "@infrastructure/logger/logger.module";

import { TodosModule } from "@application/todos/todos.module";

import { TodosController } from "@presentation/http/todos/todos.controller";
import { ConfigModule } from "@nestjs/config";

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
      }),
    }),
    LoggerModule,
    TodosModule,
  ],
  controllers: [TodosController],
})
export class AppModule {}
