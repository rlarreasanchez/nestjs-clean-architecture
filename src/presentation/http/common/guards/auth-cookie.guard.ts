import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";

@Injectable()
export class CookieAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // Session is not present or user is not logged in
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return true;
  }
}
