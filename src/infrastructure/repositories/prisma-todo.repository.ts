import { Injectable } from "@nestjs/common";

import { TodoEntity } from "@domain/entities/todo.entity";
import { ITodosRepository } from "@domain/repositories/todos-repository.interface";

import { TodoModel } from "@infrastructure/models/todo.model";
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import {
  DatabaseException,
  EntityNotFoundException,
} from "@infrastructure/exceptions/technical-exceptions";

@Injectable()
export class PrismaTodoRepository implements ITodosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTitle(title: string): Promise<TodoEntity> {
    try {
      const todo: TodoModel = await this.prisma.todo.findFirst({
        where: { content: title },
      });
      return todo ? this.toTodoEntity(todo) : null;
    } catch (error) {
      throw new DatabaseException(
        "Error occurred while accessing the database",
        "FIND_TODO_BY_TITLE_REPOSITORY"
      );
    }
  }

  async update(
    id: number,
    data: Partial<Pick<TodoEntity, "title" | "isDone">>
  ): Promise<TodoEntity> {
    try {
      const dataModel: Partial<Pick<TodoModel, "content" | "isDone">> = {
        content: data.title,
        isDone: data.isDone,
      };
      const todoUpdated: TodoModel = await this.prisma.todo.update({
        where: { id },
        data: dataModel,
      });

      return todoUpdated ? this.toTodoEntity(todoUpdated) : null;
    } catch (error) {
      if (error.code === "P2025") {
        // Prisma: Registro no encontrado
        throw new EntityNotFoundException(
          "Todo",
          id,
          "FIND_TODO_BY_ID_REPOSITORY"
        );
      }

      throw new DatabaseException(
        `Error occurred while updating Todo with id:${id}`,
        "UPDATE_TODO_REPOSITORY"
      );
    }
  }

  async insert(todo: TodoEntity): Promise<TodoEntity> {
    try {
      const newTodo: TodoModel = await this.prisma.todo.create({
        data: this.toTodoModel(todo),
      });
      return newTodo ? this.toTodoEntity(newTodo) : null;
    } catch (error) {
      throw new DatabaseException(
        "Error occurred while accessing the database",
        "INSERT_TODO_REPOSITORY"
      );
    }
  }

  async findAll(): Promise<TodoEntity[]> {
    try {
      const todos: TodoModel[] = await this.prisma.todo.findMany();
      return todos.map((todo) => this.toTodoEntity(todo));
    } catch (error) {
      throw new DatabaseException(
        "Error occurred while accessing the database",
        "FIND_ALL_TODOS_REPOSITORY"
      );
    }
  }

  async findById(id: number): Promise<TodoEntity> {
    try {
      const todo: TodoModel = await this.prisma.todo.findUnique({
        where: { id },
      });

      return todo ? this.toTodoEntity(todo) : null;
    } catch (error) {
      throw new DatabaseException(
        "Error occurred while accessing the database",
        "FIND_TODO_BY_ID_REPOSITORY"
      );
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await this.prisma.todo.delete({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseException(
        `Error occurred while deleting Todo with id:${id}`,
        "DELETE_TODO_REPOSITORY"
      );
    }
  }

  private toTodoEntity(todoModel: TodoModel): TodoEntity {
    const todoEntity: TodoEntity = new TodoEntity();

    todoEntity.id = todoModel.id;
    todoEntity.title = todoModel.content;
    todoEntity.isDone = todoModel.isDone;
    todoEntity.createdAt = todoModel.createdAt;
    todoEntity.updatedAt = todoModel.updatedAt;

    return todoEntity;
  }

  private toTodoModel(todo: TodoEntity): TodoModel {
    const todoModel: TodoModel = new TodoModel();

    todoModel.id = todo.id;
    todoModel.content = todo.title;
    todoModel.isDone = todo.isDone;

    return todoModel;
  }
}
