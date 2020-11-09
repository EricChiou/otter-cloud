import React, { FunctionComponent, useRef, RefObject, useState } from 'react';

import { intl, keys, IntlType } from 'src/i18n';
import { Cloud, Folder, CreateFolder } from 'src/components/icons';
import ItemComponent, { Item } from './item/Item';

import styles from './SideMenu.module.scss';

const SideMenu: FunctionComponent<{}> = () => {
  const fakeBucketName = 'myBucket';
  const [fakeFolders, setFakeFolders] = useState<Item[]>([
    { name: 'dir1', data: { bucketName: fakeBucketName, prefix: 'dir1/' } },
    { name: 'dir2', data: { bucketName: fakeBucketName, prefix: 'dir2/' } },
    { name: 'dir3', data: { bucketName: fakeBucketName, prefix: 'dir3/' } },
  ]);

  const sideMenuRef: RefObject<HTMLDivElement> = useRef(null);

  const folderOnSelect = (ele: HTMLElement, folder: Item) => {
    if (!ele) { return; }

    removeActiveEle();
    ele.classList.add(styles.active);

    console.log(folder);
  };

  const removeActiveEle = () => {
    if (!sideMenuRef.current) { return; }

    const avtiveEles = sideMenuRef.current.getElementsByClassName(styles.active);
    Array.from(avtiveEles).forEach((ele) => {
      ele.classList.remove(styles.active);
    });
  };

  const createFolder = (folderName: string) => {
    const data: Item = {
      name: folderName,
      data: {
        bucketName: fakeBucketName,
        prefix: folderName + '/'
      }
    };

    const folders = [...fakeFolders, data];
    setFakeFolders(folders);
  };

  return (
    <div ref={sideMenuRef} id={styles.sideMenu}>
      <ItemComponent
        ItemIcon={Cloud}
        item={{ name: intl(keys.myCloudStorge, IntlType.perUpper), data: { bucketName: fakeBucketName, prefix: '' } }}
        SubItemIcon={Folder}
        subItems={fakeFolders}
        onSelect={folderOnSelect}
        showCreateFolder={true}
        CreateItemIcon={CreateFolder}
        createItem={createFolder}
      ></ItemComponent>
    </div>
  );
};

export default SideMenu;