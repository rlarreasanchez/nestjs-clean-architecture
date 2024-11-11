import "fastify";

declare module "fastify" {
  interface FastifyResquest {
    session: Session;
  }

  interface Session extends Session {
    userId: string;
    username: string;
  }
}
