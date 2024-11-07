import { Module } from "@nestjs/common";

import { RepositoriesModule } from "@infrastructure/repositories/repositories.module";

import { GetTodoUseCase } from "./use-cases/get-todo.usecase";
import { GetTodosUseCase } from "./use-cases/get-todos.usecase";
import { CreateTodoUseCase } from "./use-cases/create-todo.usecase";
import { UpdateTodoUseCase } from "./use-cases/update-todo.usecase";
import { DeleteTodoUseCase } from "./use-cases/delete-todo.usecase";

import { TodosService } from "./todos.service";

@Module({
  imports: [RepositoriesModule],
  providers: [
    GetTodosUseCase,
    GetTodoUseCase,
    CreateTodoUseCase,
    UpdateTodoUseCase,
    DeleteTodoUseCase,
    TodosService,
  ],
  exports: [TodosService],
})
export class TodosModule {}
