import React, { FunctionComponent } from 'react';

import { File as FileInterface } from '../FileList';
import {
  File as FileIcon,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FilePdf,
  FileWord,
  FileExcel,
  FilePPT,
  FileFolder,
  More,
  Download,
} from 'src/components/icons';
import { ContentType } from 'src/constants/file';
import { Tooltip } from 'src/components/common';

import styles from '../FileList.module.scss';

interface Props {
  file: FileInterface
}

const File: FunctionComponent<Props> = ({ file }) => {
  let Icon = FileIcon;
  if (file.contentType === '') {
    Icon = FileFolder;
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

  const convertFileSize = (file: FileInterface): string => {
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

  const convertFileLastModified = (file: FileInterface): string => {
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

  return (
    <div key={file.name} className={styles.file}>
      <div className={styles.name}>
        <Tooltip content={file.name}>
          <Icon></Icon>
          <span className={`${styles.text} ${styles.iconText}`}>
            {file.name}
            <div className={styles.subLine}>
              {convertFileSize(file)}{file.contentType ? ',' : null} {convertFileLastModified(file)}
            </div>
          </span>
        </Tooltip>
      </div>
      <div className={styles.size}>
        <span className={styles.text}>{convertFileSize(file)}</span>
      </div>
      <div className={styles.modify}>
        <span className={styles.text}>{convertFileLastModified(file)}</span>
      </div>
      <div className={styles.option}>
        <Download></Download><More></More>
      </div>
    </div>
  );
};

export default File;