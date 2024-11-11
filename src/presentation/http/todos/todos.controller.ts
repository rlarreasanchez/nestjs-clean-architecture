import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";

import { TodosService } from "@application/todos/todos.service";

import { ApiResponseType } from "../common/swagger/response.decorator";

import { TodoPresenter } from "./todo.presenter";
import { CreateTodoDto } from "./dtos/create-todo.dto";
import { UpdateTodoDto } from "./dtos/update-todo.dto";
import { FastifyRequest as Request } from "fastify";
import { CookieAuthGuard } from "../common/guards/auth-cookie.guard";

@Controller({
  path: "todos",
  version: "1",
})
@UseGuards(CookieAuthGuard)
@ApiTags("Todos")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiExtraModels(TodoPresenter)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiResponseType(TodoPresenter, true)
  async findAll(@Req() req: Request) {
    const todos = await this.todosService.getTodos();

    return todos.map((todo) => new TodoPresenter(todo));
  }

  @Post()
  @HttpCode(201)
  @ApiResponseType(TodoPresenter, true)
  async create(@Body() addTodoDto: CreateTodoDto) {
    const { title } = addTodoDto;
    const todoCreated = await this.todosService.createTodo(title);

    return new TodoPresenter(todoCreated);
  }

  @Get(":id")
  @ApiResponseType(TodoPresenter, false)
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const todo = await this.todosService.getTodoById(id);

    return new TodoPresenter(todo);
  }

  @Put(":id")
  @ApiResponseType(TodoPresenter, true)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto
  ) {
    const { title, isDone } = updateTodoDto;
    const todo = await this.todosService.updateTodo({ id, title, isDone });

    return new TodoPresenter(todo);
  }

  @Delete(":id")
  @ApiResponseType(TodoPresenter, true)
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.todosService.deleteTodoById(id);

    return null;
  }
}
