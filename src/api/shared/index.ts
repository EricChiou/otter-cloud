import { RespVo, post, get } from '../request';
import { ApiUrl, ApiResult } from 'src/constants';
import { AddSharedFolderReqVo, GetSharedFolderResVo } from './vo';

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

export const getSharedFolderList = (token: string): Promise<GetSharedFolderResVo> => {
  return new Promise((resolve, reject) => {
    get(
      ApiUrl.GET_SHARED_FOLDER_LIST_URL,
      undefined,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};