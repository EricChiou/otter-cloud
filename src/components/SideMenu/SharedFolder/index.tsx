import React, { FunctionComponent, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ArrowRight, ArrowDown, FolderShared, SimpleInfo } from 'src/components/icons';
import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { Share } from 'src/interface/common';
import { BaseTooltip, BaseButton, addDialog, removeDialog } from 'src/components/common';
import { sharedFolderPermsType } from 'src/constants';

import styles from './style.module.scss';

interface Props {
  sharedFolderList: Share[];
  expand: boolean;
  expandOnClick: (e: MouseEvent<HTMLElement>) => void;
  onSelect: (ele: HTMLElement, sharedfolder: Share) => void;
}

const SharedFolder: FunctionComponent<Props> = ({
  sharedFolderList,
  expand,
  expandOnClick,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);

  const getSharedFolderClassName = (sharedFolder: Share): string => {
    return styles.sharedFolder + ((prefix.sharedId === sharedFolder.id) ? ` ${styles.active}` : '');
  };

  const sharedFolderOnSelect = (e: MouseEvent<HTMLDivElement>, sharedFolder: Share) => {
    onSelect(e.currentTarget, sharedFolder);
  };

  const getPermissionText = (permission: string): string => {
    switch (permission) {
      case sharedFolderPermsType.read:
        return intl(keys.canRead, IntlType.firstUpper);

      case sharedFolderPermsType.write:
        return intl(keys.canWrite, IntlType.firstUpper);
    }

    return permission;
  };

  const showSharedInfoDialog = (sharedFolder: Share) => {
    const component = (
      <div className={styles.sharedInfoDialog}>
        <div className={styles.dialogHeader}>{intl(keys.sharedInfo, IntlType.perUpper)}</div>
        <div className={styles.dialogBody}>
          {intl(keys.sharedFrom, IntlType.firstUpper)}：
          <BaseTooltip content={`${sharedFolder.ownerName}, ${sharedFolder.ownerAcc}`}>
            <div className={styles.dialogText}>
              {`${sharedFolder.ownerName}, ${sharedFolder.ownerAcc}`}
            </div>
          </BaseTooltip>
          {intl(keys.permission, IntlType.firstUpper)}：
          <BaseTooltip content={getPermissionText(sharedFolder.permission)}>
            <div className={styles.dialogText}>
              {getPermissionText(sharedFolder.permission)}
            </div>
          </BaseTooltip>
        </div>
        <div className={styles.dialogFooter} onClick={() => { dispatch(removeDialog()); }}>
          <BaseButton>{intl(keys.confirm, IntlType.firstUpper)}</BaseButton>
        </div>
      </div>
    );

    dispatch(addDialog({
      component: component,
      closeUI: true,
      closeByClick: true,
    }));
  };


  const renderSharedFolder = () => {
    const sharedFolderListEles = sharedFolderList
      .filter((sharedFolder) => sharedFolder.sharedAcc === userProfile.acc)
      .map((sharedFolder) => {
        const sharedPaths = sharedFolder.prefix.split('/');

        return (
          <div
            key={sharedFolder.id}
            className={getSharedFolderClassName(sharedFolder)}
            onClick={(e) => { sharedFolderOnSelect(e, sharedFolder); }}>
            <span className={styles.icon}><FolderShared></FolderShared></span>
            <span className={styles.text}>
              <BaseTooltip
                content={sharedPaths[sharedPaths.length - 2]}
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {sharedPaths[sharedPaths.length - 2]}
              </BaseTooltip>
            </span>
            <span
              className={styles.sharedFolderInfo}
              onClick={(e) => {
                e.stopPropagation();
                showSharedInfoDialog(sharedFolder);
              }}
            >
              <SimpleInfo></SimpleInfo>
            </span>
          </div >
        );
      });

    return sharedFolderListEles.length ?
      sharedFolderListEles.length :
      <div className={styles.empty}>{intl(keys.emptySharedFolderList)}</div>;
  };

  return (
    <div className={styles.sharedContainer}>
      <div className={styles.sharedRoot} onClick={expandOnClick}>
        <span className={styles.expand} >
          {expand ? <ArrowDown></ArrowDown> : <ArrowRight></ArrowRight>}
        </span>
        <span className={styles.icon}><FolderShared></FolderShared></span>
        <span className={styles.text}>{intl(keys.shareFolder, IntlType.perUpper)}</span>
      </div>
      {expand ?
        <div className={window.innerWidth > 1024 ? '' : styles.sharedFolderContainer}>
          {renderSharedFolder()}
        </div> : null
      }
    </div>
  );
};

export default SharedFolder;
