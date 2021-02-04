import { post } from '../request';
import { SingInReqVo, SingInResVo, SingUpReqVo } from './interface';
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
      resolve(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};
