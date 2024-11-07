import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect(); // Conecta al iniciar el módulo
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconecta al cerrar el módulo
  }

  // Método adicional para limpiar la base de datos, útil en pruebas
  async clearDatabase() {
    if (this.config.get("NODE_ENV") === "test") {
      await this.$transaction([
        this.todo.deleteMany(),
        // Agrega otras entidades aquí según sea necesario
      ]);
    }
  }
}
