import React, {
  FunctionComponent,
  MouseEvent,
  useRef,
  RefObject,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  ArrowRight,
  ArrowDown,
  ShareFolder,
  Cloud,
  Folder as FolderIcon,
  FolderShared,
} from 'src/components/icons';
import CreateFolder from './CreateFolder';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { addDialog, removeDialog, BaseTooltip } from 'src/components/common';
import ShareFolderDialog from 'src/components/ShareFolderDialog';
import { intl, keys, IntlType } from 'src/i18n';
import { Share } from 'src/interface/common';

import styles from './style.module.scss';

export interface Folder {
  name: string;
  data: {
    prefix: string;
  };
}

interface Props {
  folderList: Folder[];
  sharedFolderList: Share[];
  expand: boolean;
  expandOnClick: (e: MouseEvent<HTMLElement>) => void;
  onSelect: (ele: HTMLElement, folder: Folder) => void;
  createFolder: (folderName: string) => void;
}

const CloudFolder: FunctionComponent<Props> = ({
  folderList,
  sharedFolderList,
  expand,
  expandOnClick,
  onSelect,
  createFolder,
}: Props) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);
  const cloudRef: RefObject<HTMLDivElement> = useRef(null);
  const rootFolder: Folder = {
    name: intl(keys.myCloudStorge, IntlType.perUpper),
    data: { prefix: '' },
  };

  const removeActiveEle = () => {
    if (!cloudRef.current) { return; }

    const avtiveEles = cloudRef.current.getElementsByClassName(styles.active);
    Array.from(avtiveEles).forEach((ele) => {
      ele.classList.remove(styles.active);
    });
  };

  const folderOnSelect = (e: MouseEvent<HTMLDivElement>, folder: Folder) => {
    removeActiveEle();
    e.currentTarget.classList.add(styles.active);

    onSelect(e.currentTarget, folder);
  };

  const getFolderClassName = (folder: Folder): string => {
    return prefix.path === folder.data.prefix ? ` ${styles.active}` : '';
  };

  const getSubFoldersClassName = (): string => {
    return window.innerWidth > 1024 ? '' : expand ? ` ${styles.boxShadow}` : '';
  };

  const shareFolder = (folder: Folder) => {
    dispatch(addDialog({
      component: (
        <ShareFolderDialog
          folder={folder}
          close={() => { dispatch(removeDialog()); }}
        ></ShareFolderDialog>
      ),
      closeUI: true,
    }));
  };

  const renderFolderIcon = (folder: Folder) => {
    const hasSharedFolder = sharedFolderList.find((sharedFolder) => (
      sharedFolder.ownerAcc === userProfile.acc &&
      sharedFolder.prefix === folder.data.prefix
    ));

    return hasSharedFolder ? <FolderShared></FolderShared> : <FolderIcon></FolderIcon>;
  };

  const renderSubFolders = () => {
    return folderList.map((folder, i) => {
      return (
        <div
          key={i}
          className={styles.folder + getFolderClassName(folder)}
          onClick={(e) => { folderOnSelect(e, folder); }}
        >
          <span className={styles.icon}>{renderFolderIcon(folder)}</span>
          <span className={styles.text}>
            <BaseTooltip
              content={folder.name}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {folder.name}
            </BaseTooltip>
          </span>
          <span
            className={styles.share}
            onClick={(e) => {
              e.stopPropagation();
              shareFolder(folder);
            }}
          >
            <ShareFolder></ShareFolder>
          </span>
        </div>
      );
    });
  };

  return (
    <div ref={cloudRef} className={styles.cloudContainer}>
      <div
        className={styles.cloud + getFolderClassName(rootFolder)}
        onClick={(e) => { folderOnSelect(e, rootFolder); }}
      >
        <div className='vert-align-mid'></div>
        <span className={styles.expand} onClick={expandOnClick}>
          {expand ? <ArrowDown></ArrowDown> : <ArrowRight></ArrowRight>}
        </span>
        <span className={styles.icon}><Cloud></Cloud></span>
        <span className={styles.text}>{intl(keys.myCloudStorge, IntlType.perUpper)}</span>
      </div>
      <div
        className={styles.folders + getSubFoldersClassName()}
        style={{ height: expand ? 'auto' : '0px' }}
      >
        {renderSubFolders()}
        <CreateFolder createFolder={createFolder}></CreateFolder>
      </div>
    </div>
  );
};

export default CloudFolder;
