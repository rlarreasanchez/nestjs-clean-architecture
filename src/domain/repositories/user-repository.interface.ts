import { UserEntity } from "@domain/entities/user.entity";

import { GetAllUsersFilterDto } from "@domain/dtos/get-all-users-filter.dto";

export interface IUserRepository {
  getAllUsers(filter: GetAllUsersFilterDto): Promise<UserEntity[]>;
  getUserByUsername(username: string): Promise<UserEntity>;
}
