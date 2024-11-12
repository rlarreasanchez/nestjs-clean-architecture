import { UserEntity } from "@domain/entities/user.entity";
import "fastify";

declare module "fastify" {
  interface FastifyResquest {
    session: Session;
  }

  interface Session extends Session {
    userId: string;
    userData: UserEntity;
    lastUpdate: number;
  }
}
