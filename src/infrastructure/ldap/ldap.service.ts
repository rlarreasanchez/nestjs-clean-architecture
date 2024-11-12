import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import LdapClient = require("ldapjs-client");
import { LdapLoggerService } from "./ldap-logger.service";

@Injectable()
export class LdapService
  extends LdapClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LdapLoggerService
  ) {
    super({
      url: config.get("LDAP_SERVER"),
      timeout: 5000,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    });
  }

  async bind(userPrincipalName: string, password: string): Promise<void> {
    const userPrincipalNameWithSuffix =
      this.applySuffixAndPrefix(userPrincipalName);
    this.logger.debug("LDAP_BIND", `Binding user: ${userPrincipalName}`);
    await super.bind(userPrincipalNameWithSuffix, password);
    this.logger.debug("LDAP_BIND", `User binded: ${userPrincipalName}`);
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

  async search(
    base: string,
    options: LdapClient.SearchOptions
  ): Promise<unknown[]> {
    this.logger.debug(
      "LDAP_SEARCH",
      `Searching in base: ${base} with options: ${JSON.stringify(options)}`
    );
    await this.bindAdmin();
    return super.search(base, options);
  }

  async unbind() {
    this.logger.debug("LDAP_UNBIND", "Unbinding LDAP client");
    await super.unbind();
  }

  async destroy() {
    this.logger.debug("LDAP_DESTROY", "Destroying LDAP client");
    await super.destroy();
  }

  async onModuleInit() {
    this.logger.debug("LDAP_INIT", "Binding LDAP client");
  }

  async onModuleDestroy() {
    this.logger.debug("LDAP_DESTROY", "Unbinding and destroying LDAP client");
    await super.unbind();
    await super.destroy();
  }
}
