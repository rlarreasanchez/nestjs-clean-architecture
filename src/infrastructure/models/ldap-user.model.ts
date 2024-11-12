export class LdapUserModel {
  dn?: string;
  cn: string;
  sn?: string;
  l?: string;
  st?: string;
  title?: string;
  physicalDeliveryOfficeName?: string;
  givenName?: string;
  displayName?: string;
  memberOf?: string[];
  department?: string;
  company?: string;
  employeeNumber?: string;
  objectGUID?: string;
  userAccountControl?: string;
  employeeID?: string;
  division?: string;
  ipPhone?: string;
  lastLogonTimestamp?: string;
  mail?: string;
  manager?: string;
  mobile?: string;
  pager?: string;
}
