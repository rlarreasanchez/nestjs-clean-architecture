import { Inject } from "@nestjs/common";

import { UserEntity } from "@domain/entities/user.entity";
import { USER_REPOSITORY_TOKEN } from "@domain/constants/tokens.constants";
import { GetAllUsersFilterDto } from "@domain/dtos/get-all-users-filter.dto";
import { IUserRepository } from "@domain/repositories/user-repository.interface";

export class GetAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(filter: GetAllUsersFilterDto): Promise<UserEntity[]> {
    return this.userRepository.getAllUsers(filter);
  }
}
