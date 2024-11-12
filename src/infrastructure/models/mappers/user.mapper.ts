import { LdapUserModel } from "../ldap-user.model";

import { UserEntity } from "@domain/entities/user.entity";

export class UserMapper {
  static ldapUserModeltoUserEntity(ldapUserModel: LdapUserModel): UserEntity {
    const ACCOUNTDISABLE = 2; // Flag for disabled accounts
    return {
      id: ldapUserModel.cn,
      username: ldapUserModel.cn,
      email: ldapUserModel.mail,
      name: ldapUserModel.displayName,
      title: ldapUserModel.title,
      department: ldapUserModel.department,
      company: ldapUserModel.company,
      dni: ldapUserModel.employeeID,
      division: ldapUserModel.division,
      city: ldapUserModel.l,
      active:
        (+ldapUserModel.userAccountControl & ACCOUNTDISABLE) !== ACCOUNTDISABLE,
    };
  }
}
