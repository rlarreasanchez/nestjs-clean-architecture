import { Injectable } from "@nestjs/common";

import { AuthenticateUserUseCase } from "./use-cases/authenticate-user.usecase";

@Injectable()
export class AuthService {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase
  ) {}

  async authenticate(username: string, password: string) {
    return await this.authenticateUserUseCase.execute(username, password);
  }
}
