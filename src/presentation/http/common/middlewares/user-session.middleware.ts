import { Injectable, NestMiddleware } from "@nestjs/common";

import { FastifyRequest as Request, FastifyReply as Response } from "fastify";

import { UserService } from "@application/user/user.service";

@Injectable()
export class UserSessionMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: () => void) {
    // Verify if the session has user data
    if (req.session.userId) {
      await this.userService.getUserByUsername(req.session.userId);
    }

    next();
  }
}

// async use(req: Request, res: Response, next: () => void) {
//   // Verificar si la sesión tiene datos del usuario
//   if (req.session.userId) {
//     // Comprobar si la sesión ha expirado o necesita ser actualizada
//     const currentTime = Date.now();
//     const sessionAge = currentTime - req.session.user.lastUpdated;

//     // Si la sesión es más antigua de 1 hora (3600000 ms), actualizarla
//     if (sessionAge > 3600000) {
//       const updatedUserData = await get(req.session.user.username);
//       req.session.user = updatedUserData;
//     }
//   }

//   next();
// }
