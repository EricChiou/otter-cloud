import { RespVo } from '../request';

// request vo
export interface DownloadFileReqVo {
    prefix: string;
    fileName: string;
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

export interface GetPreviewUrlResVo extends RespVo {
    data: {
        url: string;
    };
}