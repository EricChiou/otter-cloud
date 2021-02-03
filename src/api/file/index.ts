import { RespVo, get, uploadPostFile, downloadPostFile, del, getBlob } from '../request';
import {
  GetFileListReqVo,
  GetFileListResVo,
  GetPreviewUrlResVo,
  DownloadFileReqVo,
  RemoveFileReqVo,
  RemoveFolderReqVo,
  GetShareableLinkResVo,
} from './interface';
import { ApiUrl } from 'src/constants';
import { uploadFileNext } from 'src/shared/file-shared';
import { TaskData } from 'src/components/TaskList/reducer';
import { ApiResult } from 'src/constants';
import { Config } from 'src/constants';

export const getFileList = (prefix: string, token: string): Promise<GetFileListResVo> => {
  const search: GetFileListReqVo = { prefix: encodeURIComponent(prefix) };

  return new Promise((resolve, reject) => {
    get(
      ApiUrl.GET_FILE_LIST,
      search,
      token
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const uploadFile = (
  task: TaskData,
  file: File,
  token: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
): Promise<RespVo> => {
  const search = { prefix: encodeURIComponent(task.prefix) };
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    uploadPostFile(
      ApiUrl.UPLOAD_FILES,
      formData,
      search,
      token,
      progress,
      task.cancelToken,
    ).then((resp) => {
      uploadFileNext();
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const getPreviewUrl = (
  prefix: string,
  fileName: string,
  token: string,
): Promise<GetPreviewUrlResVo> => {

  const search = {
    fileName: encodeURIComponent(fileName),
    prefix: encodeURIComponent(prefix),
  }

  return new Promise((resolve, reject) => {
    getBlob(
      ApiUrl.GET_PREVIEW_URL,
      search,
      token
    ).then((resp: RespVo | Blob) => {
      if (resp instanceof Blob) {
        const urlCreator = window.URL || window.webkitURL;
        const url = urlCreator.createObjectURL(resp);
        resolve({
          status: ApiResult.Success,
          data: { url },
          trace: null,
        });

      } else {
        reject(resp);
      }

    }).catch((error) => {
      reject(error);
    });
  });
};

export const downloadFile = (
  task: TaskData,
  token: string,
  progress?: (event: ProgressEvent<EventTarget>) => void
): Promise<Blob> => {

  const body: DownloadFileReqVo = {
    prefix: task.prefix,
    fileName: task.fileName
  };

  return new Promise((resolve, reject) => {
    downloadPostFile(
      ApiUrl.DOWNLOAD_FILE,
      body,
      undefined,
      token,
      progress,
      task.cancelToken,
    ).then((resp) => {
      if (resp instanceof Blob) {
        resolve(resp);
      } else {
        reject(resp);
      }

    }).catch((error) => {
      reject(error);
    });
  });
};

export const removeFile = (
  prefix: string,
  fileName: string,
  token: string,
): Promise<RespVo> => {

  const search: RemoveFileReqVo = {
    prefix: encodeURIComponent(prefix),
    fileName: encodeURIComponent(fileName),
  };

  return new Promise((resolve, reject) => {
    del(
      ApiUrl.REMOVE_FILE,
      search,
      token,
    ).then((resp: RespVo) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const removeFolder = (
  prefix: string,
  token: string,
): Promise<RespVo> => {

  const search: RemoveFolderReqVo = { prefix: encodeURIComponent(prefix) };

  return new Promise((resolve, reject) => {
    del(
      ApiUrl.REMOVE_FOLDER,
      search,
      token,
    ).then((resp: RespVo) => {
      resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const getShareableLinkUrl = (
  prefix: string,
  fileName: string,
  contentType: string,
  expiresSeconds: number,
  token: string,
): Promise<GetShareableLinkResVo> => {

  const search = {
    fileName: encodeURIComponent(fileName),
    contentType: encodeURIComponent(contentType),
    prefix: encodeURIComponent(prefix),
    clientAddr: encodeURIComponent(Config.WEB_BASE_URL),
    expiresSeconds,
  }

  return new Promise((resolve, reject) => {
    get(
      ApiUrl.GET_SHAREABLE_LINK_URL,
      search,
      token,
    ).then((resp: GetShareableLinkResVo) => {
      if (resp.status === ApiResult.Success) {
        resp.data.shareableLink = atob(resp.data.shareableLink);
        resolve(resp);

      } else {
        reject(resp);
      }

    }).catch((error) => {
      reject(error);
    });
  });
};

export const getObjectByShareableLinkUrl = (url: string): Promise<Blob> => {
  const search = { url: encodeURIComponent(url) }

  return new Promise((resolve, reject) => {
    getBlob(
      ApiUrl.GET_OBJECT_BY_SHAREABLE_LINK_URL,
      search,
    ).then((resp) => {
      if (resp instanceof Blob) {
        resolve(resp);
      } else {
        reject(resp);
      }

    }).catch((error) => {
      reject(error);
    });
  });
};
