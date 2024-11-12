import { Module } from "@nestjs/common";

import { RepositoriesModule } from "@infrastructure/repositories/repositories.module";

import { UserService } from "./user.service";
import { GetUserByUsernameUseCase } from "./use-cases/get-user-by-username.usecase";

@Module({
  imports: [RepositoriesModule],
  providers: [GetUserByUsernameUseCase, UserService],
  exports: [UserService],
})
export class UserModule {}
