import { UserEntity } from "@domain/entities/user.entity";

export interface IAuthRepository {
  authenticate(username: string, password: string): Promise<UserEntity>;
}
