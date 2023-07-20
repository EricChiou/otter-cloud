import { CancelTokenSource } from 'axios';

import {
  RespVo,
  get,
  uploadPostFile,
  downloadPostFile,
  streamPostFile,
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
  GetShareableLinkReqVo,
  GetFilePreviewUrlResVo,
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
  const search = {
    id: task.prefix.sharedId ? task.prefix.sharedId : undefined,
    prefix: encodeURIComponent(task.prefix.path),
  };
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    uploadPostFile(
      task.prefix.sharedId ? ApiUrl.UPLOAD_SHARED_FILE : ApiUrl.UPLOAD_FILES,
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

export const getVideoPreview = (
  prefix: Prefix,
  fileName: string,
  token: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<ArrayBuffer> => {
  const body: DownloadFileReqVo = {
    id: prefix.sharedId ? prefix.sharedId : undefined,
    prefix: prefix.path,
    fileName,
  };

  return new Promise((resolve, reject) => {
    streamPostFile(
      prefix.sharedId ? ApiUrl.DOWNLOAD_SHARED_FILE : ApiUrl.DOWNLOAD_FILE,
      body,
      undefined,
      token,
      progress,
      cancelToken,
    ).then((resp) => {
      if (resp instanceof ArrayBuffer) {
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
  prefix: Prefix,
  fileName: string,
  token: string,
): Promise<RespVo> => {

  const search: RemoveFileReqVo = {
    id: prefix.sharedId ? prefix.sharedId : undefined,
    prefix: encodeURIComponent(prefix.path),
    fileName: encodeURIComponent(fileName),
  };

  return new Promise((resolve, reject) => {
    del(
      prefix.sharedId ? ApiUrl.REMOVE_SHARED_FILE : ApiUrl.REMOVE_FILE,
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
  sharedId: number | null,
  prefix: string,
  token: string,
): Promise<RespVo> => {

  const search: RemoveFolderReqVo = {
    id: sharedId ? sharedId : undefined,
    prefix: encodeURIComponent(prefix),
  };

  return new Promise((resolve, reject) => {
    del(
      sharedId ? ApiUrl.REMOVE_SHARED_FOLDER : ApiUrl.REMOVE_FOLDER,
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
  prefix: Prefix,
  fileName: string,
  expiresSeconds: number,
  token: string,
): Promise<GetShareableLinkResVo> => {
  const body: GetShareableLinkReqVo = {
    id: prefix.sharedId ? prefix.sharedId : undefined,
    fileName,
    prefix: prefix.path,
    expiresSeconds,
  };

  return new Promise((resolve, reject) => {
    post(
      prefix.sharedId ? ApiUrl.GET_SHARED_FILE_SHAREABLE_LINK : ApiUrl.GET_SHAREABLE_LINK,
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
  prefix: Prefix,
  fileName: string,
  newFileName: string,
  token: string,
): Promise<GetFileListResVo> => {

  const data: RenameFileReqVo = {
    id: prefix.sharedId ? prefix.sharedId : undefined,
    prefix: prefix.path,
    fileName,
    newFileName,
  };

  return new Promise((resolve, reject) => {
    put(
      prefix.sharedId ? ApiUrl.RENAME_SHARED_FILE : ApiUrl.RENAME_FILE_URL,
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
  prefix: Prefix,
  targetPrefix: string,
  fileNames: string[],
  token: string,
): Promise<GetFileListResVo> => {

  const data: MoveFilesReqVo = {
    id: prefix.sharedId ? prefix.sharedId : undefined,
    prefix: prefix.path,
    targetPrefix,
    fileNames,
  };

  return new Promise((resolve, reject) => {
    put(
      prefix.sharedId ? ApiUrl.MOVE_SHARED_FILES : ApiUrl.MOVE_FILES_URL,
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

export const getFilePreviewUrl = (
  prefix: Prefix,
  fileName: string,
  token: string,
): Promise<GetFilePreviewUrlResVo> => {
  const body = {
    id: prefix.sharedId,
    prefix: prefix.path,
    fileName: fileName,
  };

  return new Promise((resolve, reject) => {
    post(
      prefix.sharedId ?
        ApiUrl.GET_SHARE_OFFICE_FILE_PREVIEW_URL : ApiUrl.GET_OFFICE_FILE_PREVIEW_URL,
      body,
      undefined,
      token,
    ).then((resp: RespVo) => {
      resp.status === ApiResult.Success ?
        resolve(resp as GetFilePreviewUrlResVo) : reject(resp);

    }).catch((error) => {
      reject(error);
    });
  });
};
