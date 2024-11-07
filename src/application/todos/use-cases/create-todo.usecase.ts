import { Inject, Injectable } from "@nestjs/common";

import {
  EXCEPTIONS_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
  TODOS_REPOSITORY_TOKEN,
} from "@domain/constants/tokens.constants";
import { TodoEntity } from "@domain/entities/todo.entity";
import { ILogger } from "@domain/logger/logger.interface";
import { IException } from "@domain/exceptions/exceptions.interface";
import { ITodosRepository } from "@domain/repositories/todos-repository.interface";

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILogger,
    @Inject(EXCEPTIONS_SERVICE_TOKEN)
    private readonly exceptionsService: IException,
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

    this.exceptionsService.badRequestException({
      message: "Title already exists",
      error: "TODO_TITLE_ALREADY_EXISTS",
    });
  }
}
