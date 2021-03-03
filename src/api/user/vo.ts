import { RespVo } from '../request';

// request vo
export interface SingUpReqVo {
  acc: string;
  name: string;
  pwd: string;
}
export interface SingInReqVo {
  acc: string;
  pwd: string;
  rememberMe: boolean;
}

// response vo
export interface SingInResVo extends RespVo {
  data: { token: string };
}

export interface AccListResVo extends RespVo {
  data: string[];
}