import axios, { AxiosRequestConfig, CancelTokenSource, Cancel } from 'axios';

import { Config, ApiResult } from 'src/constants';
import { tokenErrorNext } from 'src/shared/user-shared';

export interface RespVo {
  status: string;
  data: unknown;
  trace: unknown;
}

const instanceOfCancel = (object: Cancel): object is Cancel => {
  return 'message' in object;
};

const request = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 1000 * 60 * 5, // 5 min
  headers: {
    'Content-Type': 'application/json',
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (error: any) => {
  if (error.message) { return error.message; }
  if (error.response && error.response.data) {
    return error.response.data;
  }
  return error;
};

request.interceptors.response.use(
  (resp) => {
    if (200 <= resp.status && resp.status <= 299) {
      if (resp.data && resp.data.status === ApiResult.TokenError) {
        tokenErrorNext();
        return Promise.reject(resp);
      }

      return resp.data;

    } else {
      return Promise.reject(resp);
    }
  },
  (error) => {
    const err = errorHandler(error);
    if (!instanceOfCancel(err)) { console.error('api error:', err); }
    return Promise.reject(err);
  },
);

export const get = (url: string, params?: object, token?: string): Promise<RespVo> => {
  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.get(url, config);
};

export const post = (
  url: string,
  body?: object,
  params?: object,
  token?: string,
): Promise<RespVo> => {

  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.post(url, body, config);
};

export const put = (
  url: string,
  body?: object,
  params?: object,
  token?: string,
): Promise<RespVo> => {

  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.put(url, body, config);
};

export const del = (url: string, params?: object, token?: string): Promise<RespVo> => {
  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.delete(url, config);
};

export const uploadPostFile = (
  url: string,
  body?: object,
  params?: object,
  token?: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<RespVo> => {

  const config: AxiosRequestConfig = {
    params,
    timeout: 1000 * 60 * 60 * 24 * 365, // 365 days
    onUploadProgress: progress,
    cancelToken: cancelToken?.token,
  };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.post(url, body, config);
};

export const downloadPostFile = (
  url: string,
  body?: object,
  params?: object,
  token?: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<Blob> => {

  const config: AxiosRequestConfig = {
    params,
    responseType: 'blob',
    timeout: 1000 * 60 * 60 * 24 * 365, // 365 days
    onDownloadProgress: progress,
    cancelToken: cancelToken?.token,
  };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.post(url, body, config);
};

export const streamPostFile = (
  url: string,
  body?: object,
  params?: object,
  token?: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<ArrayBuffer> => {

  const config: AxiosRequestConfig = {
    params,
    responseType: 'arraybuffer',
    timeout: 1000 * 60 * 60 * 24 * 365, // 365 days
    onDownloadProgress: progress,
    cancelToken: cancelToken?.token,
  };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.post(url, body, config);
};

export const getBlob = (
  url: string,
  params?: object,
  token?: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<Blob | RespVo> => {
  const config: AxiosRequestConfig = {
    params,
    responseType: 'blob',
    onDownloadProgress: progress,
    cancelToken: cancelToken?.token,
  };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.get(url, config);
};

export const postBlob = (
  url: string,
  body: object,
  params?: object,
  token?: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<Blob | RespVo> => {
  const config: AxiosRequestConfig = {
    params,
    responseType: 'blob',
    onDownloadProgress: progress,
    cancelToken: cancelToken?.token,
  };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.post(url, body, config);
};
