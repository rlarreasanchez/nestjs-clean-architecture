import { Global, Module } from "@nestjs/common";

import { LOGGER_SERVICE_TOKEN } from "@domain/constants/tokens.constants";

import { LoggerService } from "./logger.service";

@Global()
@Module({
  providers: [
    {
      provide: LOGGER_SERVICE_TOKEN,
      useClass: LoggerService,
    },
  ],
  exports: [LOGGER_SERVICE_TOKEN],
})
export class LoggerModule {}
