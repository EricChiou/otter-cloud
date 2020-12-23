import { RespVo } from '../request';

// request vo
export interface GetFileListReqVo {
    prefix: string;
}

// response vo
export interface GetFileListResVo extends RespVo {
    data: {
        contentType: string;
        name: string;
        size: number;
        lastModified: string;
    }[];
}