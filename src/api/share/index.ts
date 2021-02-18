import { RespVo, post, get } from '../request';
import { ApiUrl, ApiResult } from 'src/constants';
import { AddSharedFolderReqVo, AddSharedFolderResVo } from './vo';

export const addSharedFolder = (
  sharedAcc: string,
  prefix: string,
  permission: string,
  token: string,
): Promise<RespVo> => {
  const body: AddSharedFolderReqVo = {
    sharedAcc,
    prefix,
    permission,
  };

  return new Promise((resolve, reject) => {
    post(
      ApiUrl.ADD_SHARED_FOLDER_URL,
      body,
      undefined,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const getShareFolderList = (token: string): Promise<AddSharedFolderResVo> => {
  return new Promise((resolve, reject) => {
    get(
      ApiUrl.GET_SHARE_FOLDER_LIST_URL,
      undefined,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};