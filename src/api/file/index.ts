import { CancelTokenSource } from 'axios';

import {
  RespVo,
  get,
  uploadPostFile,
  downloadPostFile,
  del,
  put,
  post,
  postBlob,
} from '../request';
import {
  GetFileListReqVo,
  GetFileListResVo,
  DownloadFileReqVo,
  RemoveFileReqVo,
  RemoveFolderReqVo,
  GetShareableLinkResVo,
  RenameFileReqVo,
  MoveFilesReqVo,
} from './vo';
import { ApiUrl, ApiResult } from 'src/constants';
import { uploadFileNext } from 'src/shared/file-shared';
import { TaskData } from 'src/components/TaskList/reducer';
import { Prefix } from 'src/interface/common';

export const getFileList = (prefix: string, token: string): Promise<GetFileListResVo> => {
  const search: GetFileListReqVo = { prefix: encodeURIComponent(prefix) };

  return new Promise((resolve, reject) => {
    get(
      ApiUrl.GET_FILE_LIST,
      search,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp as GetFileListResVo) : reject(resp);

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
  const search = { prefix: encodeURIComponent(task.prefix.path) };
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
  prefix: Prefix,
  fileName: string,
  token: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<Blob> => {
  const body = {
    id: prefix.sharedId,
    prefix: prefix.path,
    fileName: fileName,
  };

  return new Promise((resolve, reject) => {
    postBlob(
      prefix.sharedId ? ApiUrl.GET_SHARED_FILE_PREVIEW_URL : ApiUrl.GET_PREVIEW_URL,
      body,
      undefined,
      token,
      progress,
      cancelToken,
    ).then((resp: RespVo | Blob) => {
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

export const downloadFile = (
  task: TaskData,
  token: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
): Promise<Blob> => {

  const body: DownloadFileReqVo = {
    id: task.prefix.sharedId ? task.prefix.sharedId : undefined,
    prefix: task.prefix.path,
    fileName: task.fileName,
  };

  return new Promise((resolve, reject) => {
    downloadPostFile(
      task.prefix.sharedId ? ApiUrl.DOWNLOAD_SHARED_FILE : ApiUrl.DOWNLOAD_FILE,
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
  expiresSeconds: number,
  token: string,
): Promise<GetShareableLinkResVo> => {
  const body = {
    fileName,
    prefix,
    expiresSeconds,
  };

  return new Promise((resolve, reject) => {
    post(
      ApiUrl.GET_SHAREABLE_LINK_URL,
      body,
      undefined,
      token,
    ).then((resp: RespVo) => {
      if (resp.status === ApiResult.Success) {
        const getShareableLinkResVo = resp as GetShareableLinkResVo;
        getShareableLinkResVo.data.shareableLink = atob(getShareableLinkResVo.data.shareableLink);
        resolve(getShareableLinkResVo);

      } else {
        reject(resp);
      }

    }).catch((error) => {
      reject(error);
    });
  });
};

export const getObjectByShareableLinkUrl = (url: string): Promise<Blob> => {
  const body = { url };

  return new Promise((resolve, reject) => {
    postBlob(
      ApiUrl.GET_OBJECT_BY_SHAREABLE_LINK_URL,
      body,
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

export const renameFile = (
  prefix: string,
  filename: string,
  newFilename: string,
  token: string,
): Promise<GetFileListResVo> => {

  const data: RenameFileReqVo = { prefix, filename, newFilename };

  return new Promise((resolve, reject) => {
    put(
      ApiUrl.RENAME_FILE_URL,
      data,
      undefined,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp as GetFileListResVo) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};

export const moveFiles = (
  prefix: string,
  targetPrefix: string,
  filenames: string[],
  token: string,
): Promise<GetFileListResVo> => {

  const data: MoveFilesReqVo = { prefix, targetPrefix, filenames };

  return new Promise((resolve, reject) => {
    put(
      ApiUrl.MOVE_FILES_URL,
      data,
      undefined,
      token,
    ).then((resp) => {
      resp.status === ApiResult.Success ? resolve(resp as GetFileListResVo) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};
