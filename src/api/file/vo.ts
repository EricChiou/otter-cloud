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
  prefix: string;
}

export interface RenameFileReqVo {
  prefix: string;
  filename: string;
  newFilename: string;
}

export interface MoveFilesReqVo {
  prefix: string;
  targetPrefix: string;
  filenames: string[];
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