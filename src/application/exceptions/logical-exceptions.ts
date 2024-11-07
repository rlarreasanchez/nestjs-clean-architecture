import { HttpException } from "@nestjs/common";

export class GeneralException extends HttpException {
  constructor(message: string, status: number, errorCode?: string) {
    super(message, status, { cause: errorCode });
  }
}
