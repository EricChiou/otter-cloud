import { RespVo, post, get, put } from '../request';
import { ApiUrl, ApiResult } from 'src/constants';
import { AddSharedFolderReqVo, GetSharedFolderResVo } from './vo';
import { GetFileListResVo } from 'src/api/file/vo';

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

export const updateSharedFolder = (
  sharedId: number,
  permission: string,
  token: string,
): Promise<RespVo> => {
  const body = { id: sharedId, permission };

  return new Promise((resolve, reject) => {
    put(
      ApiUrl.UPDATE_SHARED_FOLDER_URL,
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

export const removeSharedFolder = (sharedId: number, token: string): Promise<RespVo> => {
  const body = { id: sharedId };

  return new Promise((resolve, reject) => {
    post(
      ApiUrl.REMOVE_SHARED_FOLDER_URL,
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
    ).then((resp: RespVo) => {
      resp.status === ApiResult.Success ? resolve(resp as GetSharedFolderResVo) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const getSharedFileList = (
  id: number,
  prefix: string,
  token: string,
): Promise<GetFileListResVo> => {
  const search = {
    id,
    prefix: encodeURIComponent(prefix),
  };

  return new Promise((resolve, reject) => {
    get(
      ApiUrl.GET_SHARED_FILE_LIST_URL,
      search,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp as GetFileListResVo) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};
