import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import LdapClient = require("ldapjs-client");

import { GetAllUsersFilterDto } from "@domain/dtos/get-all-users-filter.dto";

import { LdapLoggerService } from "./ldap-logger.service";
import { LdapUserModel } from "@infrastructure/models/ldap-user.model";

const FILTER_ACTIVATION = "(userAccountControl:1.2.840.113556.1.4.803:=2)";
const FILTER_IS_ACTIVE = `(!${FILTER_ACTIVATION})`;
const FILTER_IS_INACTIVE = `${FILTER_ACTIVATION}`;

@Injectable()
export class LdapService
  extends LdapClient
  implements OnModuleInit, OnModuleDestroy
{
  ldapUserProps: string[];

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
    const ldapUserModelInstance = new LdapUserModel();
    this.ldapUserProps = Object.keys(ldapUserModelInstance);
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

    let filter = `(&(objectClass=user)(objectCategory=person)(cn=${username.toUpperCase()})`;
    if (isActive !== undefined) {
      filter += isActive ? FILTER_IS_ACTIVE : FILTER_IS_INACTIVE;
    }
    filter += `)`;

    return this.search(base, {
      filter,
      scope: "sub",
      attributes: [...this.ldapUserProps],
    });
  }

  async searchAllUsers({
    active: isActive,
    company,
  }: GetAllUsersFilterDto): Promise<unknown[]> {
    const base = this.config.get("LDAP_BASE_DN");

    let filter = `(&(objectClass=user)(objectCategory=person)`;
    if (isActive !== undefined) {
      filter += isActive ? FILTER_IS_ACTIVE : FILTER_IS_INACTIVE;
    }
    if (company) {
      filter += `(company=${company})`;
    }
    filter += ")";

    return this.search(`OU=Usuarios,${base}`, {
      filter,
      scope: "sub",
      attributes: [...this.ldapUserProps],
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
