import { Global, Module } from "@nestjs/common";

import { EXCEPTIONS_SERVICE_TOKEN } from "@domain/constants/tokens.constants";

import { ExceptionsService } from "./exceptions.service";

@Global()
@Module({
  providers: [
    ExceptionsService,
    {
      provide: EXCEPTIONS_SERVICE_TOKEN,
      useClass: ExceptionsService,
    },
  ],
  exports: [EXCEPTIONS_SERVICE_TOKEN],
})
export class ExceptionsModule {}
