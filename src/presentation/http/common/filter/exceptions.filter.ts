import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";

import { ILogger } from "@domain/logger/logger.interface";
import { LOGGER_SERVICE_TOKEN } from "@domain/constants/tokens.constants";
import { ConfigService } from "@nestjs/config";
import { ServerResponse } from "http";

interface IError {
  message?: string;
  error?: string | string[];
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILogger,
    private readonly config: ConfigService
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, error: null };

    const responseData = {
      ...{
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      message:
        status >= HttpStatus.INTERNAL_SERVER_ERROR &&
        this.config.get("NODE_ENV") !== "development"
          ? "An internal server error occurred, please try again later"
          : message.message,
      errorToken: message.error,
    };

    this.logMessage(request, message, status, exception);

    response.code(status).send(responseData);
  }

  private logMessage(
    request: any,
    message: IError,
    status: number,
    exception: any
  ) {
    const { message: errorMessage, error: errorToken } = message;
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.url}`,
        `method=${request.method} status=${status} errorToken=${
          errorToken ? errorToken : null
        } message=${errorMessage ? errorMessage : null}`,
        status >= 500 ? exception.stack : ""
      );
    } else {
      this.logger.warn(
        `End Request for ${request.url}`,
        `method=${request.method} status=${status} errorToken=${
          errorToken ? errorToken : null
        } message=${errorMessage ? errorMessage : null}`
      );
    }
  }
}
