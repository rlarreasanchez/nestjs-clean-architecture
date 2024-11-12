import { Injectable, Logger } from "@nestjs/common";

import { ILogger } from "@domain/logger/logger.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LoggerService extends Logger implements ILogger {
  private readonly isDebugEnabled: boolean;

  constructor(private readonly config: ConfigService) {
    super();
    this.isDebugEnabled = this.config.get("DEBUG");
  }

  debug(context: string, message: string) {
    if (this.isDebugEnabled) {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }
  log(context: string, message: string) {
    if (this.isDebugEnabled) {
      super.log(`[INFO] ${message}`, context);
    }
  }
  error(context: string, message: string, trace?: string) {
    if (this.isDebugEnabled) {
      super.error(`[ERROR] ${message}`, trace, context);
    }
  }
  warn(context: string, message: string) {
    if (this.isDebugEnabled) {
      super.warn(`[WARN] ${message}`, context);
    }
  }
  verbose(context: string, message: string) {
    if (this.isDebugEnabled) {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
