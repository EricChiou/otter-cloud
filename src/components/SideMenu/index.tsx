import React, { FunctionComponent, useState, useEffect, useCallback, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CloudFolder, { Folder } from './CloudFolder';
import { getFileList } from 'src/api/file';
import { selectUserProfile } from 'src/store/user.slice';
import { StatusService } from 'src/service';
import { subFileShared, fileSharedActs } from 'src/shared/file-shared';
import { getDeviceInfo } from 'src/util/device-detector.util';
import { FileService } from 'src/service';
import { updateSharedFolderList, selectSharedFolderList } from 'src/store/system.slice';
import SharedFolder from './SharedFolder';
import { Share } from 'src/interface/common';

import styles from './style.module.scss';

const SideMenu: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector(selectUserProfile);
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const sharedFolderList = useSelector(selectSharedFolderList);
  const [expand, setExpand] = useState({
    cloud: getDeviceInfo()?.mobile ? false : true,
    shared: getDeviceInfo()?.mobile ? false : true,
  });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) {
        setExpand({ cloud: false, shared: false });
      }
    };
    window.addEventListener('resize', onResize);

    return () => { window.removeEventListener('resize', onResize); };
  }, []);

  const refreshFileList = useCallback(() => {
    if (!StatusService.isLogin()) { return; }

    getFileList('', userProfile.token).then((resp) => {
      const newFolderList: Folder[] = resp.data ?
        resp.data
          .filter((data) => (!FileService.isFile(data)))
          .map((data) => {
            return {
              name: data.name.slice(0, -1), // remove '/' at last of name
              data: { prefix: data.name },
            };
          }) : [];

      setFolderList(newFolderList);

    }).catch((error) => { console.log(error); });
  }, [userProfile]);

  useEffect(() => {
    refreshFileList();
    const subscribe = subFileShared((data) => {
      // console.log('subFileShared:', data);
      if (
        data.action === fileSharedActs.uploadFile ||
        data.action === fileSharedActs.moveFiles ||
        data.action === fileSharedActs.removeFile
      ) { refreshFileList(); }
    });

    return () => { subscribe.unsubscribe(); };
  }, [refreshFileList]);

  // get share folder
  useEffect(() => {
    if (!StatusService.isLogin()) { return; }

    dispatch(updateSharedFolderList(userProfile.token));
  }, [dispatch, userProfile]);

  const folderOnSelect = (ele: HTMLElement, folder: Folder) => {
    if (!ele) { return; }
    history.push({
      pathname: history.location.pathname,
      search: folder.data.prefix ? `?prefix=${encodeURIComponent(folder.data.prefix)}` : '',
    });
  };

  const sharedFolderOnSelect = (ele: HTMLElement, sharedfolder: Share) => {
    if (!ele) { return; }
    history.push({
      pathname: history.location.pathname,
      search: sharedfolder ?
        `?prefix=${encodeURIComponent(sharedfolder.prefix)}&sharedId=${sharedfolder.id}` : '',
    });
  };

  const createFolder = (folderName: string) => {
    const data: Folder = {
      name: folderName,
      data: { prefix: folderName + '/' },
    };

    const folders = [...folderList, data];
    setFolderList(folders);
  };

  const cloudExpandOnClick = (e?: MouseEvent<HTMLElement>) => {
    if (e) { e.stopPropagation(); }
    setExpand({
      cloud: !expand.cloud,
      shared: window.innerWidth > 1024 ? expand.shared : (!expand.cloud ? false : expand.shared),
    });
  };

  const sharedExpandOnClick = (e?: MouseEvent<HTMLElement>) => {
    if (e) { e.stopPropagation(); }
    setExpand({
      cloud: window.innerWidth > 1024 ? expand.cloud : (!expand.shared ? false : expand.cloud),
      shared: !expand.shared,
    });
  };

  return (
    <div id={styles.sideMenu}>
      <CloudFolder
        folderList={folderList}
        sharedFolderList={sharedFolderList}
        expand={expand.cloud}
        expandOnClick={cloudExpandOnClick}
        onSelect={folderOnSelect}
        createFolder={createFolder}
      ></CloudFolder>
      <SharedFolder
        sharedFolderList={sharedFolderList}
        expand={expand.shared}
        expandOnClick={sharedExpandOnClick}
        onSelect={sharedFolderOnSelect}
      ></SharedFolder>
    </div>
  );
};

export default SideMenu;