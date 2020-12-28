import React, { FunctionComponent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { intl, keys, IntlType } from 'src/i18n';
import { Cloud, Folder, CreateFolder } from 'src/components/icons';
import ItemComponent, { Item } from './item/Item';
import { setPrefix, selectFileList } from 'src/store/system.slice';
import { ApiResult } from 'src/constants';
import { getFileList } from 'src/api/file';
import { selectUserProfile } from 'src/store/user.slice';
import { StatusService } from 'src/service';

import styles from './style.module.scss';

const SideMenu: FunctionComponent<{}> = () => {
  const [folderList, setFolderList] = useState<Item[]>([]);

  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const fileList = useSelector(selectFileList);

  useEffect(() => {
    if (!StatusService.isLogin()) { return; }

    getFileList("", userProfile.token).then((resp) => {
      if (resp.status === ApiResult.Success) {
        const newFolderList: Item[] = resp.data
          .filter((data) => (!data.contentType && !data.size))
          .map((data) => {
            return {
              name: data.name.substring(0, data.name.length - 1),
              data: {
                bucketName: userProfile.bucketName,
                prefix: data.name,
              },
            };
          });

        setFolderList(newFolderList);
      }

    }).catch((error) => { console.log(error); });

  }, [userProfile, fileList]);

  const folderOnSelect = (ele: HTMLElement, folder: Item) => {
    if (!ele) { return; }
    dispatch(setPrefix(folder.data.prefix));
  };

  const createFolder = (folderName: string) => {
    const data: Item = {
      name: folderName,
      data: {
        bucketName: userProfile.bucketName,
        prefix: folderName + '/'
      }
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
          data: { bucketName: userProfile.bucketName, prefix: '' },
        }}
        SubItemIcon={Folder}
        subItems={folderList}
        defaultExpand={true}
        onSelect={folderOnSelect}
        showCreateFolder={true}
        CreateItemIcon={CreateFolder}
        createItem={createFolder}
      ></ItemComponent>
    </div>
  );
};

export default SideMenu;