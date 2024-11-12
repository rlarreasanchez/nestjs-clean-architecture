import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class GetAllUsersFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === "true" || value === "1" || value === true || value === 1
  )
  @IsBoolean()
  readonly active?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly company?: string;
}
