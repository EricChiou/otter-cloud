import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { Download, } from 'src/components/icons';
import FileOptions from './FileOptions';
import { selectPrefix } from 'src/store/system.slice';
import { addTask } from 'src/shared/task-shared';
import { TaskType, TaskStatus, TaskData } from 'src/components/TaskList/reducer';
import FileName from './FileName';

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
    const timStamp = new Date().getTime();
    const task: TaskData = {
      id: `${timStamp}_${0}`,
      type: TaskType.download,
      prefix,
      fileName: file.name,
      status: TaskStatus.waiting,
      progress: 0,
      cancelToken: axios.CancelToken.source(),
      contentType: file.contentType,
    }

    addTask([task]);
  };

  return (
    <div className={`${table.file} ${styles.file}`}>
      <div className={table.nameCol} onClick={() => { onSelected(file, index); }}>
        <FileName
          file={file}
          convertFileSize={convertFileSize}
          convertFileLastModified={convertFileLastModified}
        ></FileName>
      </div>
      <div className={table.sizeCol}>
        <span className={table.text}>{convertFileSize()}</span>
      </div>
      <div className={table.modifyCol}>
        <span className={table.text}>{convertFileLastModified()}</span>
      </div>
      <div className={table.optionCol}>
        {(file.size && file.contentType) ? <Download onClick={download}></Download> : null}
        <FileOptions file={file}></FileOptions>
      </div>
    </div >
  );
}

export default FileComponent;
