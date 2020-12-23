import { post } from '../request';
import { SingInReqVo, SingInResVo } from './interface';

const userGroupUrl = '/user';

export const login = (acc: string, pwd: string): Promise<SingInResVo> => {
    const body: SingInReqVo = {
        acc,
        pwd
    };

    return new Promise((resolve, reject) => {
        post(
            userGroupUrl + '/signIn',
            body
        ).then((resp) => {
            resolve(resp);

        }).catch((error) => {
            reject(error);
        });
    });
};
