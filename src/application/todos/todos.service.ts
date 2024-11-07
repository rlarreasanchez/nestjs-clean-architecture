import { Injectable } from "@nestjs/common";

import { GetTodoUseCase } from "./use-cases/get-todo.usecase";
import { GetTodosUseCase } from "./use-cases/get-todos.usecase";
import { CreateTodoUseCase } from "./use-cases/create-todo.usecase";
import { DeleteTodoUseCase } from "./use-cases/delete-todo.usecase";
import { UpdateTodoUseCase } from "./use-cases/update-todo.usecase";

import { UpdateTodoInput } from "./inputs/update-todo.input";

@Injectable()
export class TodosService {
  constructor(
    private readonly getTodosUseCase: GetTodosUseCase,
    private readonly getTodoUseCase: GetTodoUseCase,
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase
  ) {}

  async getTodos() {
    return await this.getTodosUseCase.execute();
  }

  async getTodoById(id: number) {
    return await this.getTodoUseCase.execute(id);
  }

  async createTodo(description: string) {
    return await this.createTodoUseCase.execute(description);
  }

  async updateTodo(updateTodoInput: UpdateTodoInput) {
    return await this.updateTodoUseCase.execute(updateTodoInput);
  }

  async deleteTodoById(id: number) {
    return await this.deleteTodoUseCase.execute(id);
  }
}
