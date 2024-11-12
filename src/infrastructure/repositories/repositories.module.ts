import { Module } from "@nestjs/common";

import {
  AUTH_REPOSITORY_TOKEN,
  TODOS_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from "@domain/constants/tokens.constants";

import { PrismaModule } from "../prisma/prisma.module";
import { LdapModule } from "../ldap/ldap.module";

import { PrismaTodoRepository } from "./prisma-todo.repository";
import { LdapAuthRepository } from "./ldap-auth.repository";
import { LdapUserRepository } from "./ldap-user.repository";

@Module({
  imports: [PrismaModule, LdapModule],
  providers: [
    {
      provide: TODOS_REPOSITORY_TOKEN,
      useClass: PrismaTodoRepository,
    },
    {
      provide: AUTH_REPOSITORY_TOKEN,
      useClass: LdapAuthRepository,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: LdapUserRepository,
    },
  ],
  exports: [
    TODOS_REPOSITORY_TOKEN,
    AUTH_REPOSITORY_TOKEN,
    USER_REPOSITORY_TOKEN,
  ],
})
export class RepositoriesModule {}
