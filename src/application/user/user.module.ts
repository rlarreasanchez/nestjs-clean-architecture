import { Module } from "@nestjs/common";

import { RepositoriesModule } from "@infrastructure/repositories/repositories.module";

import { UserService } from "./user.service";
import { GetAllUsersUseCase } from "./use-cases/get-all-users.usecase";
import { GetUserByUsernameUseCase } from "./use-cases/get-user-by-username.usecase";

@Module({
  imports: [RepositoriesModule],
  providers: [GetAllUsersUseCase, GetUserByUsernameUseCase, UserService],
  exports: [UserService],
})
export class UserModule {}
