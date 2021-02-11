import React, {
  FunctionComponent,
  useEffect,
  RefObject,
  useRef,
  useState,
  useCallback,
  MouseEvent,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectPrefix,
  setPrefix,
  selectFileList,
  setFileList,
  setFile,
} from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import FileComponent from './File';
import { File } from 'src/vo/common';
import FileListMenu from './FileListMenu';
import { getFileList } from 'src/api/file';
import { StatusService } from 'src/service';
import { subFileShared, fileSharedActs, fileListOnScroll } from 'src/shared/file-shared';
import Header from './Header';
import FileListDropFile from './FileListDropFile';
import loading from 'src/assets/img/loading2.gif';

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
  const [onLoading, setOnloading] = useState(false);
  const [viewType, setViewType] = useState<ViewType>(ViewType.icon);
  const [anchorPoint, setAnchorPoint] = useState<number | null>(null);

  const refreshFileList = useCallback(() => {
    setOnloading(true);
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

    }).catch((error) => {
      console.log(error);

    }).finally(() => {
      setOnloading(false);
    });

  }, [prefix, userProfile, dispatch]);

  useEffect(() => {
    if (!StatusService.isLogin()) { return; }

    refreshFileList();
    const subscribe = subFileShared((data) => {
      switch (data.action) {
        case fileSharedActs.uploadFile:
        case fileSharedActs.removeFile:
        case fileSharedActs.renameFile:
        case fileSharedActs.moveFiles:
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

  const changeViewType = () => {
    switch (viewType) {
      case ViewType.list:
        setViewType(ViewType.icon);
        break;
      case ViewType.icon:
        setViewType(ViewType.list);
        break;
    }
  }

  const fileOnSelected = (e: MouseEvent, file: File, index: number) => {
    if (!file.contentType && !file.size) {
      dispatch(setPrefix(prefix + file.name));

    } else {
      const file = Object.assign({}, fileList[index]);
      file.selected = !file.selected;
      dispatch(setFile(file, index));

      rangeSelection(e, file, index);
    }
  };

  const rangeSelection = (e: MouseEvent, file: File, index: number) => {
    if (file.selected && !e.shiftKey) {
      setAnchorPoint(index);
    }

    if (!file.selected && !e.shiftKey) {
      setAnchorPoint(null);
    }

    if (e.shiftKey && anchorPoint !== null) {
      for (let i = 0; i < fileList.length; i++) {
        const targetFile: File = { ...fileList[i] };

        if (i < anchorPoint && i < index) {
          targetFile.selected = false;

        } else if (i > anchorPoint && i > index) {
          targetFile.selected = false;

        } else if (i === anchorPoint) {
          targetFile.selected = true;

        } else {
          targetFile.selected = !targetFile.selected;
        }
        dispatch(setFile(targetFile, i));
      }
    }
  }

  const getFilesClassName = (): string => {
    switch (viewType) {
      case ViewType.list:
        return table.list;

      case ViewType.icon:
        return table.icon;

      default:
        return table.list;
    }
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
    <div ref={fileListRef} id={styles.fileList}>
      <Header viewType={viewType} changeViewType={changeViewType}></Header>
      {onLoading ?
        <div className={styles.onLoadingContainer}>
          <img className={styles.onLoading} src={loading} alt="loading"></img>
        </div> :
        <>
          <div className={getFilesClassName()} onScroll={() => { fileListOnScroll(); }}>
            {renderFiles()}
          </div>
          <FileListMenu showOtherOptions={showOtherOptions}></FileListMenu>
          <FileListDropFile fileListRef={fileListRef}></FileListDropFile>
        </>
      }
    </div >
  );
};

export default FikeList;
