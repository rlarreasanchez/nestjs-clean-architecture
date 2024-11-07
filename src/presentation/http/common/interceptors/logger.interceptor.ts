import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { ILogger } from "@domain/logger/logger.interface";
import { LOGGER_SERVICE_TOKEN } from "@domain/constants/tokens.constants";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const ip = this.getIP(request);

    this.logger.debug(
      `Incoming Request on ${request.url}`,
      `method=${request.method} ip=${ip}`
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(
          `End Request for ${request.url}`,
          `method=${request.method} ip=${ip} duration=${Date.now() - now}ms`
        );
      })
    );
  }

  private getIP(request: any): string {
    let ip: string;
    const ipAddr = request.headers["x-forwarded-for"];
    if (ipAddr) {
      const list = ipAddr.split(",");
      ip = list[list.length - 1];
    } else {
      ip = request.socket.remoteAddress;
    }
    return ip.replace("::ffff:", "");
  }
}
