import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTodoDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}
