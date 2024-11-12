import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { FastifyRequest } from "fastify";

import { UserService } from "@application/user/user.service";

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    // Session is not present or user is not logged in
    if (
      !request.session ||
      !request.session.userId ||
      !request.session.userData
    ) {
      throw new UnauthorizedException("Unauthorized");
    }

    // Verify if the user data is up to date
    const now = Date.now();
    const lastUpdate = request.session.lastUpdate || 0;
    const { username } = request.session.userData;
    // If the user data is older than 5 minutes, refresh it
    if (now - lastUpdate > 300000) {
      // Refresh the user data
      const updatedUserData =
        await this.userService.getUserByUsername(username);

      if (!updatedUserData || !updatedUserData.active) {
        request.session.destroy();
        throw new UnauthorizedException("Unauthorized");
      }
      // Update the session data
      request.session.userData = { ...updatedUserData };
      request.session.lastUpdate = now;
    }

    return true;
  }
}
