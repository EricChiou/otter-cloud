export interface UserProfile {
  token: string;
  acc: string;
  name: string;
  roleCode: string;
  ip: string;
  exp: number;
}

export interface Prefix {
  sharedId: number | null;
  path: string;
}

export interface File {
  contentType: string;
  name: string; // unique key
  size: number;
  lastModified: string;
  selected: boolean;
}

export interface Share {
  id: number; // pk
  ownerAcc: string;
  ownerName: string;
  sharedAcc: string;
  sharedName: string;
  prefix: string;
  permission: string;
  createdDate: number;
  updatedDate: number;
}
