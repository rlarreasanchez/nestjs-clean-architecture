import { Inject, Injectable } from "@nestjs/common";

import {
  LOGGER_SERVICE_TOKEN,
  TODOS_REPOSITORY_TOKEN,
} from "@domain/constants/tokens.constants";
import { ILogger } from "@domain/logger/logger.interface";
import { ITodosRepository } from "@domain/repositories/todos-repository.interface";

@Injectable()
export class DeleteTodoUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILogger,
    @Inject(TODOS_REPOSITORY_TOKEN)
    private readonly todoRepository: ITodosRepository
  ) {}

  async execute(id: number): Promise<void> {
    await this.todoRepository.deleteById(id);
    this.logger.debug("DELETE_TODO_USECASE", `Todo ${id} have been deleted`);
  }
}
