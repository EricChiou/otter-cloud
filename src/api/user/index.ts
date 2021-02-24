import { post, get } from '../request';
import { SingInReqVo, SingInResVo, SingUpReqVo, AccListResVo } from './vo';
import { ApiUrl } from 'src/constants';
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
      resolve(resp);

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
      resolve(resp as SingInResVo);

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
      resolve(resp as AccListResVo);

    }).catch((error) => {
      reject(error);
    });
  });
};
