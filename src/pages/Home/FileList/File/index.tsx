import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { ContentType } from 'src/constants/file';
import { BaseTooltip } from 'src/components/common';
import {
  File as FileIcon, FileText, FileImage, FileAudio, FileVideo,
  FileArchive, FilePdf, FileWord, FileExcel, FilePPT, FileFolder,
  Download, CheckBox,
} from 'src/components/icons';
import FileOptions from './FileOptions';
import { selectPrefix } from 'src/store/system.slice';
import { TaskType, TaskData, addTask } from 'src/shared/task-shared';

import styles from './style.module.scss';
import table from '../table.module.scss';

export interface File {
  contentType: string;
  name: string; // unique key
  size: number;
  lastModified: string;
  selected: boolean;
}

interface Props {
  file: File;
  index: number;
  onSelected: (file: File, index: number) => void;
}

const FileComponent: FunctionComponent<Props> = ({ file, index, onSelected }) => {
  const prefix = useSelector(selectPrefix);

  const convertFileSize = (): string => {
    if (file.contentType === '') { return ''; }

    const rounded = (size: number): number => {
      return Math.round(size * 100) / 100;
    };

    if (file.size < 1024) {
      return `${rounded(file.size)} Bytes`;
    } else if (file.size < 1024 * 1024) {
      return `${rounded(file.size / 1024)} KB`;
    } else if (file.size < 1024 * 1024 * 1024) {
      return `${rounded(file.size / (1024 * 1024))} MB`;
    } else if (file.size < 1024 * 1024 * 1024 * 1024) {
      return `${rounded(file.size / (1024 * 1024 * 1024))} GB`;
    }
    return `${rounded(file.size / (1024 * 1024 * 1024 * 1024))} TB`;
  };

  const convertFileLastModified = (): string => {
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
  };

  const download = () => {
    // console.log('Download File', file);
    const task: TaskData = {
      type: TaskType.download,
      prefix,
      fileName: file.name,
    }

    addTask([task]);
  };

  const renderIcon = () => {
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

    return <Icon></Icon>;
  };

  return (
    <div className={`${table.file} ${styles.file}`}>
      <div className={table.nameCol} onClick={() => { onSelected(file, index); }}>
        <BaseTooltip content={file.name}>
          {file.selected ?
            <span className={styles.active}><CheckBox></CheckBox></span> :
            <span>{renderIcon()}</span>
          }
          <span className={`${table.text} ${styles.text} ${styles.iconText}`}>
            {file.name}
            <div className={styles.subLine}>
              {convertFileSize()}{file.contentType ? ', ' : null}
              {convertFileLastModified()}
            </div>
          </span>
        </BaseTooltip>
      </div>
      <div className={table.sizeCol}>
        <span className={table.text}>{convertFileSize()}</span>
      </div>
      <div className={table.modifyCol}>
        <span className={table.text}>{convertFileLastModified()}</span>
      </div>
      <div className={table.optionCol}>
        <Download onClick={download}></Download>
        <FileOptions file={file}></FileOptions>
      </div>
    </div >
  );
}

export default FileComponent;
