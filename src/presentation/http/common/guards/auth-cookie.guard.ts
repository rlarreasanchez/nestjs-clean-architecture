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

    console.log({
      userId: request.session.userId,
      expires: request.session.cookie.expires,
      sessionId: request.session.sessionId,
    });

    // Valida la cookie
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return true; // Permite la solicitud si todo es válido
  }
}
