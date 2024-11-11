import { AUTH_REPOSITORY_TOKEN } from "@domain/constants/tokens.constants";
import { AuthResult } from "@domain/entities/auth-result.entity";
import { IAuthRepository } from "@domain/repositories/auth-repository.interface";
import { Inject } from "@nestjs/common";

export class AuthenticateUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(username: string, password: string): Promise<AuthResult> {
    return this.authRepository.authenticate(username, password);
  }
}
