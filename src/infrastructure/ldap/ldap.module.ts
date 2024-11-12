import { Module } from "@nestjs/common";

import { LdapService } from "./ldap.service";
import { LdapLoggerService } from "./ldap-logger.service";

@Module({
  providers: [LdapService, LdapLoggerService],
  exports: [LdapService],
})
export class LdapModule {}
