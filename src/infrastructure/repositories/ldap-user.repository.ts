import { Injectable } from "@nestjs/common";

import { UserEntity } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/repositories/user-repository.interface";

import { LdapService } from "@infrastructure/ldap/ldap.service";
import { LdapUserModel } from "@infrastructure/models/ldap-user.model";
import { UserMapper } from "@infrastructure/models/mappers/user.mapper";
import { LdapServerException } from "@infrastructure/exceptions/technical-exceptions";

@Injectable()
export class LdapUserRepository implements IUserRepository {
  constructor(private readonly ldapClient: LdapService) {}
  async getUserByUsername(username: string): Promise<UserEntity | null> {
    try {
      const result = await this.ldapClient.searchByUsername({
        username,
      });

      if (!result || result.length === 0) {
        return null;
      }

      return UserMapper.ldapUserModeltoUserEntity(result[0] as LdapUserModel);
    } catch (error) {
      throw new LdapServerException(
        error.message,
        "LDAP_GET_USER_SERVER_ERROR"
      );
    }
  }
}
