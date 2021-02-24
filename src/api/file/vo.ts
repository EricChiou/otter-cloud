import { RespVo } from '../request';

// request vo
export interface GetFileListReqVo {
  prefix: string;
}

export interface DownloadFileReqVo {
  id?: number;
  prefix: string;
  fileName: string;
}

export interface RemoveFileReqVo {
  id?: number;
  prefix: string;
  fileName: string;
}

export interface RemoveFolderReqVo {
  id?: number;
  prefix: string;
}

export interface RenameFileReqVo {
  id?: number;
  prefix: string;
  fileName: string;
  newFileName: string;
}

export interface MoveFilesReqVo {
  id?: number;
  prefix: string;
  targetPrefix: string;
  fileNames: string[];
}

export interface GetShareableLinkReqVo {
  id?: number;
  fileName: string;
  prefix: string;
  expiresSeconds: number;
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

export interface GetShareableLinkResVo extends RespVo {
  data: {
    shareableLink: string;
  };
}