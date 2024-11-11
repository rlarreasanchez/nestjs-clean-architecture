import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import LdapClient = require("ldapjs-client");

@Injectable()
export class LdapService extends LdapClient implements OnModuleDestroy {
  constructor(private config: ConfigService) {
    super({
      url: config.get("LDAP_SERVER"),
      timeout: 30000,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    });
  }

  async bind(userPrincipalName: string, password: string): Promise<void> {
    const userPrincipalNameWithSuffix =
      this.applySuffixAndPrefix(userPrincipalName);
    await super.bind(userPrincipalNameWithSuffix, password);
  }

  private applySuffixAndPrefix(userPrincipalName: string): string {
    const suffix = this.config.get("LDAP_ACCOUNT_SUFFIX");
    const prefix = this.config.get("LDAP_ACCOUNT_PREFIX");

    if (suffix && !userPrincipalName.includes(suffix)) {
      userPrincipalName = `${prefix}${userPrincipalName}${suffix}`;
    }

    return userPrincipalName;
  }

  async onModuleDestroy() {
    await this.destroy();
  }
}
