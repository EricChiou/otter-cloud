export interface UserProfile {
  token: string;
  id: number | null;
  acc: string;
  name: string;
  roleCode: string;
  roleName: string;
  bucketName: string;
  exp: number;
}