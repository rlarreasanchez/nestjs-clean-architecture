import { Injectable } from "@nestjs/common";

import { UserEntity } from "@domain/entities/user.entity";
import { IAuthRepository } from "@domain/repositories/auth-repository.interface";

import {
  LdapInvalidCredentialsException,
  LdapServerException,
} from "@infrastructure/exceptions/technical-exceptions";
import { LdapService } from "@infrastructure/ldap/ldap.service";
import { UserMapper } from "@infrastructure/models/mappers/user.mapper";
import { LdapUserModel } from "@infrastructure/models/ldap-user.model";

@Injectable()
export class LdapAuthRepository implements IAuthRepository {
  constructor(private readonly ldapClient: LdapService) {}
  async authenticate(username: string, password: string): Promise<UserEntity> {
    try {
      await this.ldapClient.bind(username, password);

      const result = await this.ldapClient.searchByUsername({
        username,
        isActive: true,
      });

      return UserMapper.ldapUserModeltoUserEntity(result[0] as LdapUserModel);
    } catch (error: any) {
      // LDAP error code 49 means invalid credentials
      if (error.code === 49) {
        throw new LdapInvalidCredentialsException(
          "Invalid credentials",
          "LDAP_AUTHENTICATE_CREDENTIALS_ERROR"
        );
      }
      throw new LdapServerException(
        error.message,
        "LDAP_AUTHENTICATE_SERVER_ERROR"
      );
    }
  }
}
