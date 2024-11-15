import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";

import { FastifyReply as Response, FastifyRequest as Request } from "fastify";

import { AuthService } from "@application/auth/auth.service";

import { LoginDto } from "./dtos/login.dto";
import { AuthPresenter } from "./auth.presenter";
import { AuthSessionGuard } from "../common/guards/auth-session.guard";
import { ApiResponseType } from "../common/swagger/response.decorator";

@Controller({
  path: "auth",
})
@ApiTags("Auth")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiExtraModels(AuthPresenter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @ApiResponseType(AuthPresenter, false)
  async login(@Body() authentication: LoginDto, @Req() req: Request) {
    const { username, password } = authentication;
    const user = await this.authService.authenticate(username, password);

    req.session.userId = username;
    req.session.userData = user;
    req.session.lastUpdate = Date.now();

    return new AuthPresenter(user);
  }

  @Post("logout")
  @UseGuards(AuthSessionGuard)
  @HttpCode(204)
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({
          message: "Session could not be destroyed",
        });
      }

      res.clearCookie("sessionId", { path: "/" });

      return res.status(204).send();
    });
  }

  @Get("me")
  @UseGuards(AuthSessionGuard)
  @HttpCode(200)
  async me(@Req() req: Request) {
    return req.session.userData;
  }
}
