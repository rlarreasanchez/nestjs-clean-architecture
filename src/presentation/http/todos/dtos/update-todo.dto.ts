import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTodoDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isDone?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;
}
