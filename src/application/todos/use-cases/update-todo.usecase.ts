import { Inject, Injectable } from "@nestjs/common";

import {
  EXCEPTIONS_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
  TODOS_REPOSITORY_TOKEN,
} from "@domain/constants/tokens.constants";
import { TodoEntity } from "@domain/entities/todo.entity";
import { ILogger } from "@domain/logger/logger.interface";
import { ITodosRepository } from "@domain/repositories/todos-repository.interface";

import { UpdateTodoInput } from "../inputs/update-todo.input";
import { DatabaseException } from "@infrastructure/exceptions/technical-exceptions";

@Injectable()
export class UpdateTodoUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILogger,
    @Inject(TODOS_REPOSITORY_TOKEN)
    private readonly todoRepository: ITodosRepository
  ) {}

  async execute(updateInput: UpdateTodoInput): Promise<TodoEntity> {
    try {
      const { id, title, isDone } = updateInput;
      const updatedTodo = await this.todoRepository.update(id, {
        title,
        isDone,
      });
      this.logger.debug(
        "UPDATE_TODO_USECASE",
        `Todo with id ${id} have been updated`
      );
      return updatedTodo;
    } catch (error) {
      throw error;
    }
  }
}
