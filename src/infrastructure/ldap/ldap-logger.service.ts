import { Injectable, Logger } from "@nestjs/common";

import { ILogger } from "@domain/logger/logger.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LdapLoggerService extends Logger implements ILogger {
  private readonly isDebugEnabled: boolean;

  constructor(private readonly config: ConfigService) {
    super();
    this.isDebugEnabled = this.config.get("LDAP_DEBUG");
  }

  debug(context: string, message: string) {
    if (this.isDebugEnabled) {
      super.debug(`[LDAP_DEBUG] ${message}`, context);
    }
  }
}
