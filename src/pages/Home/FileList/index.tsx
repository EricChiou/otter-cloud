import React, {
  FunctionComponent,
  useEffect,
  DragEvent,
  RefObject,
  useRef,
  useState,
  useCallback
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  selectPrefix,
  setPrefix,
  selectFileList,
  setFileList,
  setFile,
} from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { intl, keys, IntlType } from 'src/i18n';
import FileComponent, { File } from './File';
import FileListMenu from './FileListMenu';
import { Upload } from 'src/components/icons';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';
import { getFileList, removeFile } from 'src/api/file';
import { StatusService } from 'src/service';
import { addTask } from 'src/shared/task-shared';
import { TaskType, TaskStatus, TaskData } from 'src/components/TaskList/reducer';
import { subFileShared, fileSharedActs, removeFileNext } from 'src/shared/file-shared';
import deleteDialog from './deleteDialog';

import styles from './style.module.scss';
import table from './table.module.scss';

export enum ViewType {
  list = 'list',
  icon = 'icon',
}

const FikeList: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);
  const fileListRef: RefObject<HTMLDivElement> = useRef(null);
  const fileList = useSelector(selectFileList);
  const [showOtherOptions, setShowOtherOptions] = useState<boolean>(false);
  const [viewType, setViewType] = useState<ViewType>(ViewType.icon);

  const refreshFileList = useCallback(
    () => {
      getFileList(prefix, userProfile.token).then((resp) => {
        if (resp.data) {
          const fileList: File[] = resp.data.map((data) => {
            return {
              contentType: data.contentType,
              name: data.name.replace(prefix, ''),
              size: data.size,
              lastModified: data.lastModified,
              selected: false,
            };
          });
          dispatch(setFileList(fileList));
        } else {
          dispatch(setFileList([]));
        }

      }).catch((error) => { console.log(error); });
    }, [prefix, userProfile, dispatch]);

  useEffect(() => {
    if (!StatusService.isLogin()) { return; }

    refreshFileList();
    const subscribe = subFileShared((data) => {
      switch (data.action) {
        case fileSharedActs.uploadFile:
        case fileSharedActs.removeFile:
          refreshFileList();
          break;
      }
    });

    return () => { subscribe.unsubscribe(); }

  }, [refreshFileList]);

  useEffect(() => {
    const result = fileList.find((file) => file.selected);
    if (result && !showOtherOptions) {
      setShowOtherOptions(true);
    } else if (!result && showOtherOptions) {
      setShowOtherOptions(false);
    }
  }, [fileList, showOtherOptions]);

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    uploadFiles(e.dataTransfer.files);
    fileListRef.current?.classList.remove(styles.dragOver);
  };

  const dragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add(styles.dragOver);
  };

  const dragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileListRef.current?.classList.remove(styles.dragOver);
  };

  const fileOnSelected = (file: File, index: number) => {
    if (!file.contentType && !file.size) {
      dispatch(setPrefix(prefix + file.name));

    } else {
      const file = Object.assign({}, fileList[index]);
      file.selected = !file.selected;
      dispatch(setFile(file, index));
    }
  };

  const uploadFiles = (files: FileList) => {
    // console.log('Upload Files', fileList);
    const timStamp = new Date().getTime();
    const tasks = Array.from(files).map((file, index) => {
      const task: TaskData = {
        id: `${timStamp}_${index}`,
        type: TaskType.upload,
        prefix,
        fileName: file.name,
        status: TaskStatus.waiting,
        progress: 0,
        cancelToken: axios.CancelToken.source(),
        file: file,
      }
      return task;
    });

    addTask(tasks);
  };

  const downloadFiles = () => {
    const files = fileList.filter((file) => file.selected);
    // console.log('Download Files', files);
    const timStamp = new Date().getTime();
    const tasks = files.map((file, index) => {
      const task: TaskData = {
        id: `${timStamp}_${index}`,
        type: TaskType.download,
        prefix,
        fileName: file.name,
        status: TaskStatus.waiting,
        progress: 0,
        cancelToken: axios.CancelToken.source(),
        contentType: file.contentType,
      }
      return task;
    });

    addTask(tasks);
  };

  const showDeleteWarning = () => {
    const component = deleteDialog(
      deleteFiles,
      () => { dispatch(removeDialog()); }
    );
    dispatch(addDialog({ component }));
  };

  const deleteFiles = () => {
    const files = fileList.filter((file) => file.selected);
    // console.log('Delete Files', files);
    dispatch(removeDialog());
    files.forEach(async (file) => {
      await removeFile(prefix, file.name, userProfile.token);
    });
    removeFileNext();
  };

  const renderFiles = () => {
    return fileList.map((file, index) => {
      return (
        <FileComponent
          key={file.name}
          file={file}
          index={index}
          onSelected={fileOnSelected}
          viewType={viewType}
        ></FileComponent>
      );
    });
  };

  return (
    <div ref={fileListRef} id={styles.fileList} onDragOver={dragOver}>
      {viewType === ViewType.list ?
        <div className={table.header}>
          <div className={table.nameCol}>
            <span className={table.text}>{intl(keys.fileName, IntlType.firstUpper)}</span>
          </div>
          <div className={table.sizeCol}>
            <span className={table.text}>{intl(keys.fileSize, IntlType.firstUpper)}</span>
          </div>
          <div className={table.modifyCol}>
            <span className={table.text}>{intl(keys.lastModified, IntlType.firstUpper)}</span>
          </div>
          <div className={table.optionCol}></div>
        </div>
        : null
      }
      <div className={table.list}>
        {renderFiles()}
      </div>
      <FileListMenu
        showOtherOptions={showOtherOptions}
        uploadFiles={uploadFiles}
        download={downloadFiles}
        del={showDeleteWarning}
      >
      </FileListMenu>
      <div className={styles.mask} onDrop={drop} onDragLeave={dragLeave}>
        <div className={styles.icon}>
          <Upload></Upload>
        </div>
      </div>
    </div>
  );
};

export default FikeList;
