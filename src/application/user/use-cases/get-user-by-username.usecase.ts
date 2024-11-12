import { Inject } from "@nestjs/common";

import { UserEntity } from "@domain/entities/user.entity";
import { USER_REPOSITORY_TOKEN } from "@domain/constants/tokens.constants";
import { IUserRepository } from "@domain/repositories/user-repository.interface";

export class GetUserByUsernameUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(username: string): Promise<UserEntity> {
    return this.userRepository.getUserByUsername(username);
  }
}
