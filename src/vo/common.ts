export interface UserProfile {
  token: string | null;
  id: number | null;
  acc: string | null;
  name: string | null;
  role: string | null;
  lang: string;
  exp: number;
}