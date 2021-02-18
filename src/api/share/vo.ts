import { RespVo } from '../request';

// request vo
export interface AddSharedFolderReqVo {
  sharedAcc: string;
  prefix: string;
  permission: string;
}

// response vo
export interface AddSharedFolderResVo extends RespVo {
  data: {
    id: number;
    sharedAcc: string;
    sharedName: string;
    prefix: string;
    permission: string;
  }[];
}
