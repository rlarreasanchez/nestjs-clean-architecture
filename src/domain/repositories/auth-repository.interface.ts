import { AuthResult } from "@domain/entities/auth-result.entity";

export interface IAuthRepository {
  authenticate(username: string, password: string): Promise<AuthResult>;
}
