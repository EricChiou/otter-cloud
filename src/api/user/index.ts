import { post, get, put } from '../request';
import { SingInReqVo, SingInResVo, SingUpReqVo, AccListResVo } from './vo';
import { ApiResult, ApiUrl } from 'src/constants';
import { RespVo } from '../request';

export const signUp = (acc: string, name: string, pwd: string): Promise<RespVo> => {
  const body: SingUpReqVo = {
    acc,
    name,
    pwd,
  };

  return new Promise((resolve, reject) => {
    post(
      ApiUrl.SIGN_UP,
      body,
    ).then((resp: RespVo) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const login = (acc: string, pwd: string): Promise<SingInResVo> => {
  const body: SingInReqVo = {
    acc,
    pwd,
  };

  return new Promise((resolve, reject) => {
    post(
      ApiUrl.SIGN_IN,
      body,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp as SingInResVo) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const getUserFuzzyList = (acc: string, token: string): Promise<AccListResVo> => {
  const search = { keyword: encodeURIComponent(acc) };

  return new Promise((resolve, reject) => {
    get(
      ApiUrl.GET_USER_FUZZY_LIST,
      search,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp as AccListResVo) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const activateAcc = (activeCode: string): Promise<RespVo> => {
  const body = { activeCode };

  return new Promise((resolve, reject) => {
    put(
      ApiUrl.ACTIVATE_ACCOUNT,
      body,
      undefined,
      undefined,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const sendActivationCode = (acc: string): Promise<RespVo> => {
  const body = { acc };

  return new Promise((resolve, reject) => {
    put(
      ApiUrl.SEND_ACTIVATION_CODE,
      body,
      undefined,
      undefined,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const resetPwd = (acc: string): Promise<RespVo> => {
  const body = { acc };

  return new Promise((resolve, reject) => {
    put(
      ApiUrl.RESET_PWD,
      body,
      undefined,
      undefined,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const updateUser = (
  body: { name?: string; oldPwd?: string; newPwd?: string },
  token: string,
): Promise<RespVo> => {

  return new Promise((resolve, reject) => {
    put(
      ApiUrl.UPDATE_USER,
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
