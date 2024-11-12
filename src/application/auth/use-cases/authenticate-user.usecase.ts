import { Inject } from "@nestjs/common";

import { UserEntity } from "@domain/entities/user.entity";
import { AUTH_REPOSITORY_TOKEN } from "@domain/constants/tokens.constants";
import { IAuthRepository } from "@domain/repositories/auth-repository.interface";

export class AuthenticateUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(username: string, password: string): Promise<UserEntity> {
    return this.authRepository.authenticate(username, password);
  }
}
