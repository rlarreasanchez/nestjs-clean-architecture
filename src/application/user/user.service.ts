import { Injectable } from "@nestjs/common";

import { GetAllUsersFilterDto } from "@domain/dtos/get-all-users-filter.dto";

import { GetAllUsersUseCase } from "./use-cases/get-all-users.usecase";
import { GetUserByUsernameUseCase } from "./use-cases/get-user-by-username.usecase";

@Injectable()
export class UserService {
  constructor(
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase
  ) {}

  async getUserByUsername(username: string) {
    return await this.getUserByUsernameUseCase.execute(username);
  }

  async getAllUsers(filter: GetAllUsersFilterDto) {
    return await this.getAllUsersUseCase.execute(filter);
  }
}
