import { Injectable } from "@nestjs/common";

import { GetUserByUsernameUseCase } from "./use-cases/get-user-by-username.usecase";

@Injectable()
export class UserService {
  constructor(
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase
  ) {}

  async getUserByUsername(username: string) {
    return await this.getUserByUsernameUseCase.execute(username);
  }
}
