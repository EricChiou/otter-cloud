import { post, put } from '../request';
import { GetFileListReqVo, GetFileListResVo } from './interface';
import { ApiUrl } from 'src/constants/api-url';

export const getFileList = (prefix: string, token: string): Promise<GetFileListResVo> => {
    const body: GetFileListReqVo = { prefix };

    return new Promise((resolve, reject) => {
        post(
            ApiUrl.GET_FILE_LIST,
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

export const uploadFiles = (files: FileList, prefix: string, token: string) => {
    const search = prefix ? `?prefix=${encodeURIComponent(prefix)}` : '';

    const filesFormData = new FormData();
    Array.from(files).forEach((file) => {
        filesFormData.append("files", file);
    });

    return new Promise((resolve, reject) => {
        put(
            ApiUrl.UPLOAD_FILES + search,
            filesFormData,
            undefined,
            token
        ).then((resp) => {
            resolve(resp);

        }).catch((error) => {
            reject(error);
        });
    });
};
