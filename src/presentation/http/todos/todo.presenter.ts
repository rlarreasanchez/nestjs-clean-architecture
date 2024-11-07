import { ApiProperty } from "@nestjs/swagger";

import { TodoEntity } from "@domain/entities/todo.entity";

export class TodoPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  isDone: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(todo: TodoEntity) {
    this.id = todo.id;
    this.title = todo.title;
    this.isDone = todo.isDone;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}
