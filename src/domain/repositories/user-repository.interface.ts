import { UserEntity } from "@domain/entities/user.entity";

export interface IUserRepository {
  getUserByUsername(username: string): Promise<UserEntity>;
}
