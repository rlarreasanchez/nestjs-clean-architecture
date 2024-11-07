import { Module } from "@nestjs/common";

import { TODOS_REPOSITORY_TOKEN } from "@domain/constants/tokens.constants";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaTodoRepository } from "./prisma-todo.repository";

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: TODOS_REPOSITORY_TOKEN,
      useClass: PrismaTodoRepository,
    },
  ],
  exports: [TODOS_REPOSITORY_TOKEN],
})
export class RepositoriesModule {}
