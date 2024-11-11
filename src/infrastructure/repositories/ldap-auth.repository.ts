import { ConfigService } from "@nestjs/config";

import { IAuthRepository } from "@domain/repositories/auth-repository.interface";
import { AuthResult } from "@domain/entities/auth-result.entity";
import {
  LdapInvalidCredentialsException,
  LdapServerException,
} from "@infrastructure/exceptions/technical-exceptions";
import { LdapService } from "@infrastructure/ldap/ldap.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LdapAuthRepository implements IAuthRepository {
  ldapClient: LdapService;

  constructor(private config: ConfigService) {
    this.ldapClient = new LdapService(this.config);
  }

  async authenticate(username: string, password: string): Promise<AuthResult> {
    try {
      // Intentar autenticar al usuario con bind.
      await this.ldapClient.bind(username, password);

      // Si llega aquí, la autenticación fue exitosa.
      return new AuthResult(true);
    } catch (error: any) {
      // Capturar errores de autenticación o conexión.
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
