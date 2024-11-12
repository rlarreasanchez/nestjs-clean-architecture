import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";

import { GetAllUsersFilterDto } from "@domain/dtos/get-all-users-filter.dto";

import { UserService } from "@application/user/user.service";

import { UserPresenter } from "./user.presenter";
import { ApiResponseType } from "../common/swagger/response.decorator";

@Controller("users")
@ApiTags("Users")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiExtraModels(UserPresenter)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("")
  @HttpCode(200)
  @ApiResponseType(UserPresenter, true)
  async findAll(@Query() query: GetAllUsersFilterDto) {
    const users = await this.userService.getAllUsers(query);
    console.log({ dataLength: users.length });

    return users.map((user) => new UserPresenter(user));
  }
}
