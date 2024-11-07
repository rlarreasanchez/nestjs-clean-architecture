import { TodoEntity } from "../entities/todo.entity";

export interface ITodosRepository {
  insert(todo: TodoEntity): Promise<TodoEntity>;
  findAll(): Promise<TodoEntity[]>;
  findById(id: number): Promise<TodoEntity>;
  findByTitle(title: string): Promise<TodoEntity>;
  update(
    id: number,
    data: Partial<Pick<TodoEntity, "title" | "isDone">>
  ): Promise<TodoEntity>;
  deleteById(id: number): Promise<void>;
}
