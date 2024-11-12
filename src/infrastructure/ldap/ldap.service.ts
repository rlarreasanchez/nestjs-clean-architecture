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

  private async bindAdmin(): Promise<void> {
    const adminUser = this.config.get("LDAP_ADMIN_USERNAME");
    const adminPassword = this.config.get("LDAP_ADMIN_PASSWORD");

    await super.bind(adminUser, adminPassword);
  }

  async search(
    base: string,
    options: LdapClient.SearchOptions
  ): Promise<unknown[]> {
    await this.bindAdmin();
    return super.search(base, options);
  }

  async searchByUsername({
    username,
    isActive,
  }: {
    username: string;
    isActive?: boolean;
  }): Promise<unknown[]> {
    const base = this.config.get("LDAP_BASE_DN");

    const filterIsActive = isActive
      ? "(!(userAccountControl:1.2.840.113556.1.4.803:=2))"
      : "";

    return this.search(base, {
      filter: `(&(objectClass=user)(objectCategory=person)(cn=${username.toUpperCase()})${filterIsActive})`,
      scope: "sub",
    });
  }

  async onModuleDestroy() {
    await super.unbind();
    await super.destroy();
  }
}
