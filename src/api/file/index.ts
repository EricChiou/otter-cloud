import { RespVo, get, post, filePost } from '../request';
import {
    GetFileListResVo,
    GetPreviewUrlResVo,
    DownloadFileReqVo,
} from './interface';
import { ApiUrl } from 'src/constants/api-url';
import { uploadFileNext } from 'src/shared/file-shared';

export const getFileList = (prefix: string, token: string): Promise<GetFileListResVo> => {
    const search = { prefix: encodeURIComponent(prefix) };

    return new Promise((resolve, reject) => {
        get(
            ApiUrl.GET_FILE_LIST,
            search,
            token
        ).then((resp) => {
            resolve(resp);

        }).catch((error) => {
            reject(error);
        });
    });
};

export const uploadFiles = (files: FileList, prefix: string, token: string): Promise<RespVo> => {
    const search = { prefix: encodeURIComponent(prefix) };

    const filesFormData = new FormData();
    Array.from(files).forEach((file) => {
        filesFormData.append("files", file);
    });

    return new Promise((resolve, reject) => {
        post(
            ApiUrl.UPLOAD_FILES,
            filesFormData,
            search,
            token
        ).then((resp) => {
            uploadFileNext();
            resolve(resp);

        }).catch((error) => {
            reject(error);
        });
    });
};

export const getPreviewUrl =
    (prefix: string, fileName: string, token: string): Promise<GetPreviewUrlResVo> => {
        const search = {
            fileName: encodeURIComponent(fileName),
            prefix: encodeURIComponent(prefix),
        }

        return new Promise((resolve, reject) => {
            get(
                ApiUrl.GET_PREVIEW_URL,
                search,
                token
            ).then((resp: GetPreviewUrlResVo) => {
                resp.data.url = atob(resp.data.url);
                resolve(resp);

            }).catch((error) => {
                reject(error);
            });
        });
    };

export const downloadFile = (prefix: string, fileName: string, token: string): Promise<Blob> => {
    const body: DownloadFileReqVo = { prefix, fileName };

    return new Promise((resolve, reject) => {
        filePost(
            ApiUrl.DOWNLOAD_FILE,
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