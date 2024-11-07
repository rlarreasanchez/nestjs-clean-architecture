export interface IFormatExceptionMessage {
  message: string | string[];
  error?: string;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): void;
  internalServerErrorException(data?: IFormatExceptionMessage): void;
  forbiddenException(data?: IFormatExceptionMessage): void;
  unauthorizedException(data?: IFormatExceptionMessage): void;
  resourceNotFoundException(data?: IFormatExceptionMessage): void;
}
