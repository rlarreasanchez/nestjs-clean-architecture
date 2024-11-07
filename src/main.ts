import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { LOGGER_SERVICE_TOKEN } from "@domain/constants/tokens.constants";

import { AllExceptionFilter } from "@presentation/http/common/filter/exceptions.filter";
import { LoggingInterceptor } from "@presentation/http/common/interceptors/logger.interceptor";
import {
  ResponseFormat,
  ResponseInterceptor,
} from "@presentation/http/common/interceptors/response.interceptor";

import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Config
  const config = app.get(ConfigService);

  // Filter
  const logger = app.get(LOGGER_SERVICE_TOKEN);
  app.useGlobalFilters(new AllExceptionFilter(logger, config));

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
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
