import { Inject, Injectable } from "@nestjs/common";

import { TodoEntity } from "@domain/entities/todo.entity";
import {
  LOGGER_SERVICE_TOKEN,
  TODOS_REPOSITORY_TOKEN,
} from "@domain/constants/tokens.constants";
import { ILogger } from "@domain/logger/logger.interface";
import { ITodosRepository } from "@domain/repositories/todos-repository.interface";

@Injectable()
export class GetTodoUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILogger,
    @Inject(TODOS_REPOSITORY_TOKEN)
    private readonly todoRepository: ITodosRepository
  ) {}

  async execute(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findById(id);
    this.logger.debug("GET_TODO_USECASE", `Todo ${id} have been retrieved`);
    return todo;
  }
}
