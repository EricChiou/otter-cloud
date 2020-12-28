import { RespVo, get, post, put } from '../request';
import { GetFileListReqVo, GetFileListResVo, GetPreviewUrlResVo } from './interface';
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

export const uploadFiles = (files: FileList, prefix: string, token: string): Promise<RespVo> => {
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

export const getPreviewUrl =
    (prefix: string, fileName: string, token: string): Promise<GetPreviewUrlResVo> => {
        let search = `?fileName=${encodeURIComponent(fileName)}`;
        if (prefix) { search += `&prefix=${encodeURIComponent(prefix)}`; }

        return new Promise((resolve, reject) => {
            get(
                ApiUrl.GET_PREVIEW_URL + search,
                undefined,
                token
            ).then((resp: GetPreviewUrlResVo) => {
                resp.data.url = atob(resp.data.url);
                resolve(resp);

            }).catch((error) => {
                reject(error);
            });
        });
    };
