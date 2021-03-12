import React, { FunctionComponent, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { Download, CheckBox } from 'src/components/icons';
import FileOptions from './FileOptions';
import { selectPrefix } from 'src/store/system.slice';
import { addTask } from 'src/shared/task-shared';
import { TaskType, TaskStatus, TaskData } from 'src/components/TaskList/reducer';
import FileName from './FileName';
import { ViewType } from '../..';
import FileIcon from './FileIcon';
import { File } from 'src/interface/common';
import { FileService } from 'src/service';
import { showPreviewFileDialog } from 'src/components/PreviewFileDialog';

import styles from './style.module.scss';
import table from '../../table.module.scss';

interface Props {
  file: File;
  index: number;
  onSelected: (e: MouseEvent, file: File, index: number) => void;
  viewType: ViewType;
}

const FileComponent: FunctionComponent<Props> = ({
  file,
  index,
  onSelected,
  viewType,
}) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);

  const convertFileSize = (): string => {
    if (!FileService.isFile(file)) { return ''; }

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
        return num < 10 ? `0${num}` : `${num}`;
      };

      const dateTime = new Date(file.lastModified);
      const month = convertTime(dateTime.getMonth() + 1);
      const date = convertTime(dateTime.getDate());
      const hour = convertTime(dateTime.getHours());
      const minute = convertTime(dateTime.getMinutes());

      return `${dateTime.getFullYear()}-${month}-${date} ${hour}:${minute}`;

    } catch (error) {
      console.error(error);
      return file.lastModified;
    }
  };

  const download = () => {
    // console.log('Download File', file);
    const timeStamp = new Date().getTime();
    const task: TaskData = {
      id: `${timeStamp}_${0}`,
      type: TaskType.download,
      prefix: prefix,
      fileName: file.name,
      status: TaskStatus.waiting,
      progress: 0,
      cancelToken: axios.CancelToken.source(),
      contentType: file.contentType,
    };

    addTask([task]);
  };

  const onDoubleClick = (e: MouseEvent, file: File) => {
    e.preventDefault();

    const fileType = FileService.getFileType(file.contentType, file.size);
    switch (true) {
      case fileType.isText:
      case fileType.isImage:
      case fileType.isPdf:
      case fileType.isWord:
      case fileType.isExcel:
      case fileType.isPpt:
        dispatch(showPreviewFileDialog(file));
    }
  };

  return (
    <>
      { viewType === ViewType.list ?
        <div className={`${table.file} ${styles.file}`}>
          <div
            className={table.nameCol}
            onClick={(e) => { onSelected(e, file, index); }}
            onDoubleClick={(e) => { onDoubleClick(e, file); }}
          >
            <FileName
              file={file}
              convertFileSize={convertFileSize}
              convertFileLastModified={convertFileLastModified}
              viewType={viewType}
            ></FileName>
          </div>
          <div className={table.sizeCol}>
            <span className={table.text}>{convertFileSize()}</span>
          </div>
          <div className={table.modifyCol}>
            <span className={table.text}>{convertFileLastModified()}</span>
          </div>
          <div className={table.optionCol}>
            {FileService.isFile(file) ? <Download onClick={download}></Download> : null}
            <FileOptions
              file={file}
              viewType={viewType}
            ></FileOptions>
          </div>
        </div> : null
      }
      { viewType === ViewType.icon ?
        <div className={`${styles.icon}`}>
          <div
            className={styles.iconContainer}
            onClick={(e) => { onSelected(e, file, index); }}
            onDoubleClick={(e) => { onDoubleClick(e, file); }}
          >
            {file.selected ?
              <div className={styles.selected}>
                <CheckBox></CheckBox>
              </div> : null
            }
            <div className={styles.svg}>
              <div className={'vert-align-mid'}></div>
              <FileIcon file={file} viewType={viewType}></FileIcon>
            </div>
          </div>
          <div className={styles.secondLine}>
            <FileName
              file={file}
              convertFileSize={convertFileSize}
              convertFileLastModified={convertFileLastModified}
              viewType={viewType}
            ></FileName>
            <div className={styles.options}>
              {FileService.isFile(file) ? <Download onClick={download}></Download> : null}
              <FileOptions
                file={file}
                viewType={viewType}
              ></FileOptions>
            </div>
          </div>
        </div> : null
      }
    </>
  );
};

export default FileComponent;
