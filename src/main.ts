import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import * as cookie from "@fastify/cookie";
import Redis from "ioredis";
import fastifySession from "@fastify/session";

import { LOGGER_SERVICE_TOKEN } from "@domain/constants/tokens.constants";

import {
  ResponseFormat,
  ResponseInterceptor,
} from "@presentation/http/common/interceptors/response.interceptor";
import { AllExceptionFilter } from "@presentation/http/common/filter/exceptions.filter";
import { LoggingInterceptor } from "@presentation/http/common/interceptors/logger.interceptor";

import { AppModule } from "./app.module";

async function bootstrap() {
  // create app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // config
  const config = app.get(ConfigService);

  // registry cookie plugin
  await app.register(cookie, {
    secret: config.get("COOKIE_SECRET"),
  });

  // registry Redis plugin
  const redisClient = new Redis({
    host: config.get("REDIS_HOST"),
    port: config.get("REDIS_PORT"),
  });

  // registry session plugin
  app.register(fastifySession, {
    secret: config.get("SESSION_SECRET"),
    cookieName: "SESSION_ID",
    store: {
      get: (sessionId: string, callback) => {
        redisClient.get(sessionId, (err, result) => {
          callback(err, result ? JSON.parse(result) : null);
        });
      },
      set: (sessionId, sessionContent, callback) => {
        const ttl: number = config.get("SESSION_EXPIRES_IN_SECONDS");
        redisClient.setex(
          sessionId,
          ttl,
          JSON.stringify(sessionContent),
          callback
        );
      },
      destroy: (sessionId, callback) => {
        redisClient.del(sessionId, callback);
      },
    },
    cookie: {
      path: "/",
      httpOnly: true,
      secure: config.get("NODE_ENV") === "production", // Only send cookie over HTTPS
      maxAge: config.get("SESSION_EXPIRES_IN_SECONDS") * 1000,
    },
    saveUninitialized: false,
  });

  // filter
  const logger = app.get(LOGGER_SERVICE_TOKEN);
  app.useGlobalFilters(new AllExceptionFilter(logger, config));

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable transformation
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableVersioning({
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  // global api prefix
  app.setGlobalPrefix("api");

  // swagger config
  if (config.get("NODE_ENV") !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .addBearerAuth()
      .setTitle("Clean Architecture Nestjs")
      .setDescription("Example with todo list")
      .setVersion("1")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    });
    SwaggerModule.setup("api", app, document);
  }

  await app.listen(config.get("PORT"));
}
bootstrap();
