import { post } from '../request';
import { GetFileListReqVo, GetFileListResVo } from './interface';

const fileGroupUrl = '/file';

export const getFileList = (prefix: string, token: string): Promise<GetFileListResVo> => {
    const body: GetFileListReqVo = { prefix };

    return new Promise((resolve, reject) => {
        post(
            fileGroupUrl + '/list',
            body,
            undefined,
            token
        ).then((resp) => {
            resolve(resp);

        }).catch((error) => {
            reject(error);
        });
    });
};