import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { intl, keys, IntlType } from 'src/i18n';
import { Cloud, Folder, CreateFolder, FolderShared } from 'src/components/icons';
import ItemComponent, { Item } from './item';
import { getFileList } from 'src/api/file';
import { selectUserProfile } from 'src/store/user.slice';
import { StatusService } from 'src/service';
import { subFileShared, fileSharedActs } from 'src/shared/file-shared';
import { getDeviceInfo } from 'src/util/device-detector.util';
import { FileService } from 'src/service';
import { updateSharedFolderList, selectSharedFolderList } from 'src/store/system.slice';

import styles from './style.module.scss';

const SideMenu: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector(selectUserProfile);
  const [folderList, setFolderList] = useState<Item[]>([]);
  const sharedFolderList = useSelector(selectSharedFolderList);

  const refreshFileList = useCallback(() => {
    if (!StatusService.isLogin()) { return; }

    getFileList('', userProfile.token).then((resp) => {
      const newFolderList: Item[] = resp.data
        .filter((data) => (!FileService.isFile(data)))
        .map((data) => {
          return {
            name: data.name.slice(0, -1), // remove '/' at last of name
            data: { prefix: data.name },
          };
        });

      setFolderList(newFolderList);

    }).catch((error) => { console.log(error); });

  }, [userProfile]);

  useEffect(() => {
    refreshFileList();
    const subscribe = subFileShared((data) => {
      // console.log('subFileShared:', data);
      if (data.action === fileSharedActs.uploadFile) { refreshFileList(); }
    });

    return () => { subscribe.unsubscribe(); };

  }, [refreshFileList]);

  // get share folder
  useEffect(() => {
    if (!StatusService.isLogin()) { return; }

    dispatch(updateSharedFolderList(userProfile.token));

  }, [dispatch, userProfile]);

  const getSharedFolderListItems = (): Item[] => {
    return sharedFolderList.
      filter((sharedFolder) => sharedFolder.sharedAcc === userProfile.acc).
      map((sharedFolder) => ({
        name: sharedFolder.prefix.slice(0, -1),
        data: {
          prefix: sharedFolder.prefix,
        },
      }));
  };

  const folderOnSelect = (ele: HTMLElement, folder: Item) => {
    if (!ele) { return; }
    history.push({
      pathname: history.location.pathname,
      search: folder.data.prefix ? `?prefix=${encodeURIComponent(folder.data.prefix)}` : '',
    });
  };

  const createFolder = (folderName: string) => {
    const data: Item = {
      name: folderName,
      data: { prefix: folderName + '/' },
    };

    const folders = [...folderList, data];
    setFolderList(folders);
  };

  return (
    <div id={styles.sideMenu}>
      <ItemComponent
        ItemIcon={Cloud}
        item={{
          name: intl(keys.myCloudStorge, IntlType.perUpper),
          data: { prefix: '' },
        }}
        SubItemIcon={Folder}
        subItems={folderList}
        defaultExpand={getDeviceInfo()?.mobile ? false : true}
        onSelect={folderOnSelect}
        showCreateItem={true}
        CreateItemIcon={CreateFolder}
        createItem={createFolder}
      ></ItemComponent>
      <ItemComponent
        ItemIcon={FolderShared}
        item={{
          name: intl(keys.sharedFolder, IntlType.perUpper),
          data: { prefix: '' },
        }}
        SubItemIcon={FolderShared}
        subItems={getSharedFolderListItems()}
        defaultExpand={getDeviceInfo()?.mobile ? false : true}
        onSelect={folderOnSelect}
        showCreateItem={false}
        CreateItemIcon={CreateFolder}
        createItem={createFolder}
      ></ItemComponent>
    </div>
  );
};

export default SideMenu;