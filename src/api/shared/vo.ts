import { RespVo } from '../request';

// request vo
export interface AddSharedFolderReqVo {
  sharedAcc: string;
  prefix: string;
  permission: string;
}

// response vo
export interface GetSharedFolderResVo extends RespVo {
  data: {
    id: number;
    ownerAcc: string;
    ownerName: string;
    sharedAcc: string;
    sharedName: string;
    prefix: string;
    permission: string;
  }[];
}
