import { Inject, Injectable } from "@nestjs/common";

import {
  LOGGER_SERVICE_TOKEN,
  TODOS_REPOSITORY_TOKEN,
} from "@domain/constants/tokens.constants";
import { TodoEntity } from "@domain/entities/todo.entity";
import { ILogger } from "@domain/logger/logger.interface";
import { ITodosRepository } from "@domain/repositories/todos-repository.interface";

import { EntityAlreadyExistsException } from "@application/exceptions/logical-exceptions";

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILogger,
    @Inject(TODOS_REPOSITORY_TOKEN)
    private readonly todoRepository: ITodosRepository
  ) {}

  async execute(title: string): Promise<TodoEntity> {
    await this.validateTitle(title);
    try {
      const todo = new TodoEntity();
      todo.title = title;
      todo.isDone = false;
      const result = await this.todoRepository.insert(todo);
      this.logger.debug(
        "CREATE_TODO_USECASE",
        `New todo have been inserted with id: ${result.id}`
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  private async validateTitle(title: string): Promise<void> {
    const todo = await this.todoRepository.findByTitle(title);

    if (!todo) return;

    throw new EntityAlreadyExistsException(
      "Todo",
      "title",
      title,
      "TODO_TITLE_ALREADY_EXISTS"
    );
  }
}
