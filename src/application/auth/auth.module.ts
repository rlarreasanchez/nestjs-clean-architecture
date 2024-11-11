import { Module } from "@nestjs/common";

import { RepositoriesModule } from "@infrastructure/repositories/repositories.module";

import { AuthService } from "./auth.service";
import { AuthenticateUserUseCase } from "./use-cases/authenticate-user.usecase";

@Module({
  imports: [RepositoriesModule],
  providers: [AuthenticateUserUseCase, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
