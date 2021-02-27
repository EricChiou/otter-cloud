import React, {
  FunctionComponent,
  useEffect,
  RefObject,
  useRef,
  useState,
  MouseEvent,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectPrefix,
  selectFileList,
  selectFileListOnLoading,
  updateFileList,
  setFile,
} from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import FileComponent from './File';
import { File } from 'src/interface/common';
import FileListMenu from './FileListMenu';
import { StatusService } from 'src/service';
import { subFileShared, fileSharedActs, fileListOnScroll } from 'src/shared/file-shared';
import Header from './Header';
import FileListDropFile from './FileListDropFile';
import { FileService } from 'src/service';

import loading from 'src/assets/img/loading2.gif';
import styles from './style.module.scss';
import table from './table.module.scss';

export enum ViewType {
  list = 'list',
  icon = 'icon',
}

const FikeList: FunctionComponent<{}> = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);
  const fileListRef: RefObject<HTMLDivElement> = useRef(null);
  const fileList = useSelector(selectFileList);
  const fileListOnLoading = useSelector(selectFileListOnLoading);
  const [showOtherOptions, setShowOtherOptions] = useState<boolean>(false);
  const [viewType, setViewType] = useState<ViewType>(ViewType.list);
  const [anchorPoint, setAnchorPoint] = useState<number | null>(null);
  const [showOnLoading, setShowOnLoading] = useState(true);

  useEffect(() => {
    if (!fileListOnLoading) { setShowOnLoading(false); }
  }, [fileListOnLoading]);

  useEffect(() => {
    setShowOnLoading(true);
  }, [prefix]);

  useEffect(() => {
    if (!StatusService.isLogin()) { return; }

    dispatch(updateFileList(prefix, userProfile.token));
    const subscribe = subFileShared((data) => {
      switch (data.action) {
        case fileSharedActs.uploadFile:
        case fileSharedActs.removeFile:
        case fileSharedActs.renameFile:
        case fileSharedActs.moveFiles:
          dispatch(updateFileList(prefix, userProfile.token));
          break;
      }
    });

    return () => { subscribe.unsubscribe(); };
  }, [dispatch, userProfile, prefix]);

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
  };

  const fileOnSelected = (e: MouseEvent, file: File, index: number) => {
    let search = (prefix.path + file.name) ?
      `?prefix=${encodeURIComponent(prefix.path + file.name)}` : '';
    search += prefix.sharedId ? `&sharedId=${prefix.sharedId}` : '';


    if (!FileService.isFile(file)) {
      history.push({
        pathname: history.location.pathname,
        search: search,
      });

    } else {
      const file = Object.assign({}, fileList[index]);
      file.selected = !file.selected;
      dispatch(setFile(file, index));

      rangeSelection(e, file, index);
    }
  };

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
    <div id={styles.fileList}>
      <Header viewType={viewType} changeViewType={changeViewType}></Header>
      <div ref={fileListRef} className={styles.fileListContainer}>
        <div className={getFilesClassName()} onScroll={() => { fileListOnScroll(); }}>
          {renderFiles()}
        </div>
        <FileListMenu showOtherOptions={showOtherOptions}></FileListMenu>
        <FileListDropFile fileListRef={fileListRef}></FileListDropFile>
      </div>
      {fileListOnLoading && showOnLoading ?
        <div className={`${styles.onLoadingContainer}`}>
          <img className={styles.onLoading} src={loading} alt="loading"></img>
        </div> : null
      }
    </div>
  );
};

export default FikeList;
