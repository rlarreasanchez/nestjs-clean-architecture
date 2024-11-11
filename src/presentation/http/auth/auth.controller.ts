import { Body, Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";

import { FastifyReply as Response, FastifyRequest as Request } from "fastify";

import { AuthService } from "@application/auth/auth.service";

import { LoginDto } from "./dtos/login.dto";

@Controller({
  path: "auth",
})
@ApiTags("Auth")
@ApiResponse({ status: 500, description: "Internal error" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(204)
  async login(
    @Body() authentication: LoginDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const { username, password } = authentication;
    await this.authService.authenticate(username, password);

    req.session.userId = username;

    return res.status(204).send();
  }

  @Post("logout")
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
}
