import React, { FunctionComponent } from 'react';

import {
  Setting,
  Folder,
  File,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FilePdf,
  FileWord,
  FileExcel,
  FilePPT,
} from 'src/components/icons';
import { ContentType } from 'src/constants/file';
import { intl, keys, IntlType } from 'src/i18n';

import styles from './FileList.module.scss';

interface File {
  contentType: string;
  name: string; // unique key
  size: number;
  lastModified: string;
  selected: boolean;
}

const FikeList: FunctionComponent<{}> = () => {
  const fakeFiles: File[] = [
    {
      contentType: 'application/octet-stream',
      name: 'cat',
      size: 5964,
      lastModified: '2020-11-06T14:40:02.1738874+08:00',
      selected: false,
    },
    {
      contentType: 'audio/mpeg',
      name: 'Baby Cats.mp3',
      size: 5729325,
      lastModified: '2020-11-11T12:15:57.7300048+08:00',
      selected: false,
    },
    {
      contentType: 'image/jpeg',
      name: 'cat.jpg',
      size: 5964,
      lastModified: '2020-11-06T10:39:52.4392648+08:00',
      selected: false,
    },
    {
      contentType: 'image/png',
      name: 'cat.png',
      size: 4537,
      lastModified: '2020-11-06T10:39:52.4412612+08:00',
      selected: false,
    },
    {
      contentType: 'image/jpeg',
      name: 'cat2.jpg',
      size: 7676,
      lastModified: '2020-11-06T10:39:52.4422566+08:00',
      selected: false,
    },
    {
      contentType: 'image/jpeg',
      name: 'cat3.jpg',
      size: 4023,
      lastModified: '2020-11-06T10:39:52.4412612+08:00',
      selected: false,
    },
    {
      contentType: 'application/octet-stream',
      name: 'file.7z',
      size: 90,
      lastModified: '2020-11-11T09:28:30.0011283+08:00',
      selected: false,
    },
    {
      contentType: 'text/plain',
      name: 'file.txt',
      size: 0,
      lastModified: '2020-11-11T09:26:26.0100965+08:00',
      selected: false,
    },
    {
      contentType: 'application/x-zip-compressed',
      name: 'file.zip',
      size: 150,
      lastModified: '2020-11-11T09:28:00.9691468+08:00',
      selected: false,
    },
    {
      contentType: 'video/mp4',
      name: 'mov_bbb.mp4',
      size: 788493,
      lastModified: '2020-11-11T09:27:18.0411223+08:00',
      selected: false,
    },
    {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      name: 'test.docx',
      size: 12049,
      lastModified: '2020-11-11T09:30:34.4375835+08:00',
      selected: false,
    },
    {
      contentType: 'application/pdf',
      name: 'test.pdf',
      size: 29749,
      lastModified: '2020-11-11T09:30:59.8154661+08:00',
      selected: false,
    },
    {
      contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      name: 'test.pptx',
      size: 33656,
      lastModified: '2020-11-11T09:30:34.4375835+08:00',
      selected: false,
    },
    {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      name: 'test.xlsx',
      size: 10052,
      lastModified: '2020-11-11T09:30:34.4385814+08:00',
      selected: false,
    },
    {
      contentType: '',
      name: 'subFolder/',
      size: 0,
      lastModified: '0001-01-01T00:00:00Z',
      selected: false,
    },
    {
      contentType: '',
      name: 'subFolder2/',
      size: 0,
      lastModified: '0001-01-01T00:00:00Z',
      selected: false,
    },
  ];

  const convertFileSize = (file: File): string => {
    if (file.contentType === '') { return ''; }

    if (file.size < 1024) {
      return `${getFileSizeRounded(file.size)} Bytes`;
    } else if (file.size < 1024 * 1024) {
      return `${getFileSizeRounded(file.size / 1024)} KB`;
    } else if (file.size < 1024 * 1024 * 1024) {
      return `${getFileSizeRounded(file.size / (1024 * 1024))} MB`;
    } else if (file.size < 1024 * 1024 * 1024 * 1024) {
      return `${getFileSizeRounded(file.size / (1024 * 1024 * 1024))} GB`;
    }
    return `${getFileSizeRounded(file.size / (1024 * 1024 * 1024 * 1024))} TB`;
  };

  const getFileSizeRounded = (size: number): number => {
    return Math.round(size * 100) / 100;
  }

  const convertFileLastModified = (file: File): string => {
    if (file.contentType === '') { return ''; }

    try {
      const dateTime = new Date(file.lastModified);
      const month = (dateTime.getMonth() + 1) < 10 ? `0${dateTime.getMonth() + 1}` : (dateTime.getMonth() + 1);
      const date = dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate();
      const hour = dateTime.getHours() < 10 ? `0${dateTime.getHours()}` : dateTime.getHours();
      const minute = dateTime.getMinutes() < 10 ? `0${dateTime.getMinutes()}` : dateTime.getMinutes();

      return `${dateTime.getFullYear()}-${month}-${date} ${hour}:${minute}`

    } catch (error) {
      console.error(error);
      return file.lastModified;
    }
  }

  const renderFiles = (files: File[]) => {
    return files.map((file) => {
      let Icon = File;
      if (file.contentType === '') {
        Icon = Folder;
      } else if (file.contentType.indexOf(ContentType.text) > -1) {
        Icon = FileText;
      } else if (file.contentType.indexOf(ContentType.image) > -1) {
        Icon = FileImage;
      } else if (file.contentType.indexOf(ContentType.audio) > -1) {
        Icon = FileAudio;
      } else if (file.contentType.indexOf(ContentType.video) > -1) {
        Icon = FileVideo;
      } else if (file.contentType.indexOf(ContentType.zip) > -1) {
        Icon = FileArchive;
      } else if (file.contentType.indexOf(ContentType.pdf) > -1) {
        Icon = FilePdf;
      } else if (file.contentType.indexOf(ContentType.word) > -1) {
        Icon = FileWord;
      } else if (file.contentType.indexOf(ContentType.excel) > -1) {
        Icon = FileExcel;
      } else if (file.contentType.indexOf(ContentType.ppt) > -1) {
        Icon = FilePPT;
      }

      return (
        <div key={file.name} className={styles.file}>
          <div className={styles.name}>
            <Icon></Icon> <span className={`${styles.text} ${styles.iconText}`}>{file.name}</span>
          </div>
          <div className={styles.size}>
            <span className={styles.text}>{convertFileSize(file)}</span>
          </div>
          <div className={styles.modify}>
            <span className={styles.text}>{convertFileLastModified(file)}</span>
          </div>
          <div className={styles.option}>
          </div>
        </div>
      );
    });
  };

  return (
    <div id={styles.fileList}>
      <div className={styles.header}>
        <div className={styles.name}>
          <span className={styles.text}>{intl(keys.fileName, IntlType.firstUpper)}</span>
        </div>
        <div className={styles.size}>
          <span className={styles.text}>{intl(keys.fileSize, IntlType.firstUpper)}</span>
        </div>
        <div className={styles.modify}>
          <span className={styles.text}> {intl(keys.lastModified, IntlType.firstUpper)}</span>
        </div>
        <div className={styles.option}>
          <Setting></Setting>
        </div>
      </div>
      <div className={styles.list}>
        {renderFiles(fakeFiles)}
      </div>
    </div>
  );
}

export default FikeList;
