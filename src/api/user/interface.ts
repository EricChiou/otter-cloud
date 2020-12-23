import { RespVo } from '../request';

// request vo
export interface SingInReqVo {
    acc: string;
    pwd: string;
}

// response vo
export interface SingInResVo extends RespVo {
    data: { token: string };
}