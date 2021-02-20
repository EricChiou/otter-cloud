import React, { FunctionComponent, useState, useEffect, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix, selectFileList } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { getFileList, moveFiles } from 'src/api/file';
import { File } from 'src/vo/common';
import { Folder, ArrowRight } from 'src/components/icons';
import { BaseButton } from 'src/components/common';
import { moveFilesNext } from 'src/shared/file-shared';
import { removeDialog } from 'src/components/common';
import { FileService } from 'src/service';

import styles from './style.module.scss';

const MoveFile: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const fileList = useSelector(selectFileList);
  const [listPrefix, setListPrefix] = useState('');
  const [targetPrefix, setTargetPrefix] = useState('');
  const [folderList, setFolderList] = useState<File[]>([]);

  useEffect(() => {
    getFileList(listPrefix, userProfile.token).then((resp) => {
      if (resp.data) {
        const newFolderList = resp.data.filter((file) => !FileService.isFile(file))
          .map((folder) => {
            return { ...folder, selected: false };
          });
        setFolderList(newFolderList);

      } else {
        setFolderList([]);
      }
    });

  }, [userProfile, listPrefix]);

  const changePrefix = (newPrefix: string) => {
    setListPrefix(newPrefix);
    setTargetPrefix(newPrefix);
  };

  const changeTargetPrefix = (e: MouseEvent, folderName: string) => {
    Array.from(document.getElementsByClassName(styles.active)).forEach((ele) => {
      ele.classList.remove(styles.active);
    });

    e.currentTarget.classList.add(styles.active);
    setTargetPrefix(folderName);
  };

  const getTargetFolder = (fullPrefix: string) => {
    const folders = fullPrefix.slice(0, -1).split('/');
    return folders[folders.length - 1];
  };

  const back2PreLayer = () => {
    const lastIndex = listPrefix.slice(0, -1).lastIndexOf('/');
    setListPrefix(listPrefix.slice(0, lastIndex + 1));
    setTargetPrefix(listPrefix.slice(0, lastIndex + 1));
  };

  const move = () => {
    const filenames = fileList.filter((file) => (file.selected)).map((file) => (file.name));
    moveFiles(prefix.path, targetPrefix, filenames, userProfile.token).then(() => {
      moveFilesNext();
    });

    dispatch(removeDialog());
  };

  const renderFolderList = () => {
    return (
      <div className={styles.folderList}>
        {listPrefix ?
          <div className={styles.folder} onClick={back2PreLayer}>
            <span className={styles.folderIcon}><Folder></Folder></span>
            <div className={styles.fileName}>..</div>
          </div> : null
        }
        {folderList.map((folder) => {
          return (
            <div
              key={folder.name}
              className={styles.folder}
              onClick={(e) => { changeTargetPrefix(e, folder.name); }}
            >
              <span className={styles.folderIcon}><Folder></Folder></span>
              <div className={styles.fileName}>{getTargetFolder(folder.name)}</div>
              <span className={styles.nextLayer} onClick={() => { changePrefix(folder.name); }}>
                <ArrowRight></ArrowRight>
              </span>
            </div>
          );
        })
        }
      </div >
    );
  };

  return (
    <div className={styles.moveFileDialog}>
      <div className={styles.header}>
        {intl(keys.moveTo)}
        &nbsp;
        {targetPrefix ?
          getTargetFolder(targetPrefix) :
          intl(keys.myCloudStorge, IntlType.perUpper)
        }
      </div>
      {renderFolderList()}
      <div className={styles.footer}>
        <BaseButton disabled={prefix.path === targetPrefix} onClick={move}>
          {intl(keys.move, IntlType.firstUpper)}
        </BaseButton>
      </div>
    </div>
  );
};

export default MoveFile;
