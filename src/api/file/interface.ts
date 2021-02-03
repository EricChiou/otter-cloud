import { RespVo } from '../request';

// request vo
export interface GetFileListReqVo {
  prefix: string;
}

export interface DownloadFileReqVo {
  prefix: string;
  fileName: string;
}

export interface RemoveFileReqVo {
  prefix: string;
  fileName: string;
}

export interface RemoveFolderReqVo {
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

export interface GetPreviewUrlResVo extends RespVo {
  data: {
    url: string;
  };
}

export interface GetShareableLinkResVo extends RespVo {
  data: {
    shareableLink: string;
  };
}