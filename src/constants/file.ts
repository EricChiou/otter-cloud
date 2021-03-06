import { Config } from './config';
import { ApiUrl } from './api-url';

export const ContentType = {
  file: ['octet-stream'],
  text: ['text'],
  image: ['image'],
  audio: ['audio'],
  video: ['video'],
  zip: ['zip'],
  pdf: ['pdf'],
  word: ['vnd.openxmlformats-officedocument.wordprocessingml.document'],
  excel: [
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
  ppt: ['vnd.openxmlformats-officedocument.presentationml.presentation'],
};

export const previewFileUrl = Config.API_BASE_URL + ApiUrl.GET_PREVIEW_FILE;
export const previewOfficeFileUrl = 'https://view.officeapps.live.com/op/embed.aspx';
