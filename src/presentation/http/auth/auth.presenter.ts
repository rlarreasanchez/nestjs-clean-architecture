import { UserEntity } from "@domain/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class AuthPresenter {
  @ApiProperty()
  user: UserEntity;

  constructor(user: UserEntity) {
    this.user = user;
  }
}
