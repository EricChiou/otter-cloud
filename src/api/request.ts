import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';

import { Config, ApiResult } from 'src/constants';
import { tokenErrorNext } from 'src/shared/user-shared';

export interface RespVo {
  status: string;
  data: any;
  trace: any;
}

const request = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    console.error('api error:', err);
    return Promise.reject(err);
  }
);

const errorHandler = (error: any) => {
  if (error.message) { return error.message; }
  if (error.response && error.response.data) {
    return error.response.data;
  }
  return error;
};

export const get = (url: string, params?: object, token?: string): Promise<RespVo> => {
  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.get(url, config);
};

export const post = (url: string, body: object = {}, params?: object, token?: string): Promise<RespVo> => {
  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.post(url, body, config);
};

export const put = (url: string, body: object = {}, params?: object, token?: string): Promise<RespVo> => {
  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.put(url, body, config);
};

export const del = (url: string, params?: object, token?: string): Promise<RespVo> => {
  const config: AxiosRequestConfig = { params };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.delete(url, config);
};

export const filePost = (
  url: string,
  body: object = {},
  params?: object,
  token?: string,
  progress?: (event: ProgressEvent<EventTarget>) => void,
  cancelToken?: CancelTokenSource,
): Promise<RespVo | Blob> => {

  const config: AxiosRequestConfig = {
    params,
    responseType: 'blob',
    timeout: 1000 * 60 * 60 * 24 * 365,
    onDownloadProgress: progress,
    onUploadProgress: progress,
    cancelToken: cancelToken?.token,
  };
  if (token) { config.headers = { Authorization: `Bearer ${token}` }; }

  return request.post(url, body, config);
};