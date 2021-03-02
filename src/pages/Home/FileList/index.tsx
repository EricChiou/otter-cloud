import React, { FunctionComponent, useEffect, RefObject, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectPrefix,
  selectFileList,
  selectFileListOnLoading,
  updateFileList,
} from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import FileListMenu from './FileListMenu';
import { StatusService } from 'src/service';
import { subFileShared, fileSharedActs } from 'src/shared/file-shared';
import Header from './Header';
import FileListDropFile from './FileListDropFile';
import FileListToolBar from './FileListToolBar';
import FileListFiles from './FileListFiles';

import loading from 'src/assets/img/loading2.gif';
import styles from './style.module.scss';

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
  const fileListOnLoading = useSelector(selectFileListOnLoading);
  const [showOtherOptions, setShowOtherOptions] = useState<boolean>(false);
  const [viewType, setViewType] = useState<ViewType>(ViewType.list);
  const [showOnLoading, setShowOnLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

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

  return (
    <div id={styles.fileList}>
      <FileListToolBar
        viewType={viewType}
        keyword={keyword}
        changeViewType={changeViewType}
        setKeyword={setKeyword}
      ></FileListToolBar>
      <Header viewType={viewType}></Header>
      <div ref={fileListRef} className={styles.fileListContainer}>
        <FileListFiles viewType={viewType} keyword={keyword}></FileListFiles>
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
