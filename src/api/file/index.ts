import { RespVo, get, filePost } from '../request';
import {
    GetFileListResVo,
    GetPreviewUrlResVo,
    DownloadFileReqVo,
} from './interface';
import { ApiUrl } from 'src/constants/api-url';
import { uploadFileNext } from 'src/shared/file-shared';
import { TaskData } from 'src/shared/task-shared';

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

export const uploadFile = (
    task: TaskData,
    file: File,
    token: string,
    progess?: (event: ProgressEvent<EventTarget>) => void,
): Promise<RespVo | Blob> => {

    const search = { prefix: encodeURIComponent(task.prefix) };
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
        filePost(
            ApiUrl.UPLOAD_FILES,
            formData,
            search,
            token,
            progess,
            task.cancelToken,
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

export const downloadFile = (
    task: TaskData,
    token: string,
    progess?: (event: ProgressEvent<EventTarget>) => void
): Promise<RespVo | Blob> => {

    const body: DownloadFileReqVo = {
        prefix: task.prefix,
        fileName: task.fileName
    };

    return new Promise((resolve, reject) => {
        filePost(
            ApiUrl.DOWNLOAD_FILE,
            body,
            undefined,
            token,
            progess,
            task.cancelToken,
        ).then((resp) => {
            resolve(resp);

        }).catch((error) => {
            reject(error);
        });
    });
};