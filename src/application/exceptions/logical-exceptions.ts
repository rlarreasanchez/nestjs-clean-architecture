import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

export class GeneralException extends HttpException {
  constructor(message: string, status: number, errorCode?: string) {
    super(message, status, { cause: errorCode });
  }
}

export class EntityAlreadyExistsException extends HttpException {
  constructor(
    entity: string,
    field: string,
    value: string | number,
    errorToken?: string
  ) {
    super(
      {
        message: `${entity} with ${field} '${value}' already exists`,
        error: errorToken,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
