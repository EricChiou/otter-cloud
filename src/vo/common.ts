export interface UserProfile {
  token: string;
  acc: string;
  name: string;
  roleCode: string;
  exp: number;
}

export interface File {
  contentType: string;
  name: string; // unique key
  size: number;
  lastModified: string;
  selected: boolean;
}
