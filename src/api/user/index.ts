import { post } from '../request';
import { SingInReqVo, SingInResVo } from './interface';
import { ApiUrl } from 'src/constants';

export const login = (acc: string, pwd: string): Promise<SingInResVo> => {
  const body: SingInReqVo = {
    acc,
    pwd
  };

  return new Promise((resolve, reject) => {
    post(
      ApiUrl.SIGN_IN,
      body
    ).then((resp) => {
      resolve(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};
