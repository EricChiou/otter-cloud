import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectPrefix, setPrefix } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
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
import { BaseTooltip } from 'src/components/common';

import styles from './style.module.scss';

export interface File {
  contentType: string;
  name: string; // unique key
  size: number;
  lastModified: string;
  selected: boolean;
}

interface Props {
  fileList: File[];
}

const FileTable: FunctionComponent<Props> = ({ fileList }) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const getIcon = (file: File): FunctionComponent<{}> => {
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

    return Icon;
  };

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
    try {
      const convertTime = (num: number): string => {
        return num < 10 ? `0${num}` : `${num}`
      };

      const dateTime = new Date(file.lastModified);
      const month = convertTime(dateTime.getMonth() + 1);
      const date = convertTime(dateTime.getDate());
      const hour = convertTime(dateTime.getHours());
      const minute = convertTime(dateTime.getMinutes());

      return `${dateTime.getFullYear()}-${month}-${date} ${hour}:${minute}`

    } catch (error) {
      console.error(error);
      return file.lastModified;
    }
  }

  const fileNameOnClick = (file: File) => {
    if (!file.contentType && !file.size) {
      dispatch(setPrefix(prefix + file.name));
    }
  };

  const renderFiles = () => {
    return fileList.map((file) => {
      const Icon = getIcon(file);
      return (
        <div key={file.name} className={styles.file}>
          <div className={styles.name} onClick={() => { fileNameOnClick(file); }}>
            <BaseTooltip content={file.name}>
              <Icon></Icon>
              <span className={`${styles.text} ${styles.iconText}`}>
                {file.name}
                <div className={styles.subLine}>
                  {convertFileSize(file)}{file.contentType ? ', ' : null}
                  {convertFileLastModified(file)}
                </div>
              </span>
            </BaseTooltip>
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
    });
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.name}>
          <span className={styles.text}>{intl(keys.fileName, IntlType.firstUpper)}</span>
        </div>
        <div className={styles.size}>
          <span className={styles.text}>{intl(keys.fileSize, IntlType.firstUpper)}</span>
        </div>
        <div className={styles.modify}>
          <span className={styles.text}>{intl(keys.lastModified, IntlType.firstUpper)}</span>
        </div>
        <div className={styles.option}></div>
      </div>
      {renderFiles()}
    </>
  );
};

export default FileTable;