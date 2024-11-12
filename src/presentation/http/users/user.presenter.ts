import { ApiProperty } from "@nestjs/swagger";

import { UserEntity } from "@domain/entities/user.entity";

export class UserPresenter {
  @ApiProperty()
  id: string | number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  department: string;
  @ApiProperty()
  company: string;
  @ApiProperty()
  dni: string;
  @ApiProperty()
  division: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  active: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.name = user.name;
    this.title = user.title;
    this.department = user.department;
    this.company = user.company;
    this.dni = user.dni;
    this.division = user.division;
    this.city = user.city;
    this.active = user.active;
  }
}
