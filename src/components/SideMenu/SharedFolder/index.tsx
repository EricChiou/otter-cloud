import React, { FunctionComponent, MouseEvent } from 'react';
import { useSelector } from 'react-redux';

import { ArrowRight, ArrowDown, FolderShared } from 'src/components/icons';
import { selectUserProfile } from 'src/store/user.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { Share } from 'src/vo/common';
import { BaseTooltip } from 'src/components/common';

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
  const userProfile = useSelector(selectUserProfile);

  const sharedFolderOnSelect = (e: MouseEvent<HTMLDivElement>, sharedFolder: Share) => {
    onSelect(e.currentTarget, sharedFolder);
  };

  const renderSharedFolder = () => {
    return sharedFolderList
      .filter((sharedFolder) => sharedFolder.sharedAcc === userProfile.acc)
      .map((sharedFolder) => {
        const sharedPaths = sharedFolder.prefix.split('/');

        return (
          <div
            key={sharedFolder.id}
            className={styles.sharedFolder}
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
          </div >
        );
      });
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
