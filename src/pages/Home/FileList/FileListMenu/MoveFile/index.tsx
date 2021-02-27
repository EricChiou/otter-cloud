import React, { FunctionComponent, useState, useEffect, MouseEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix, selectFileList } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { getFileList, moveFiles } from 'src/api/file';
import { getSharedFileList } from 'src/api/shared';
import { File } from 'src/interface/common';
import { Folder, ArrowRight } from 'src/components/icons';
import { BaseButton } from 'src/components/common';
import { moveFilesNext } from 'src/shared/file-shared';
import { removeDialog } from 'src/components/common';
import { FileService } from 'src/service';
import loading from 'src/assets/img/loading2.gif';
import { addMessage, MessageType } from 'src/components/Message';
import { ApiResult } from 'src/constants';

import styles from './style.module.scss';

const MoveFile: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const fileList = useSelector(selectFileList);
  const [listPrefix, setListPrefix] = useState(prefix.sharedId ?
    prefix.path.split('/')[0] + '/' : '');
  const [targetPrefix, setTargetPrefix] = useState(prefix.sharedId ?
    prefix.path.split('/')[0] + '/' : '');
  const [folderList, setFolderList] = useState<File[]>([]);
  const [onLoading, setOnloading] = useState(false);

  const parseFolderName = useCallback((folderName: string): string => {
    const root = prefix.path.split('/')[0] + '/';
    const index = folderName.indexOf(root);

    return folderName.slice(index);
  }, [prefix]);

  useEffect(() => {
    const promise = prefix.sharedId ?
      getSharedFileList(prefix.sharedId, listPrefix, userProfile.token) :
      getFileList(listPrefix, userProfile.token);

    setOnloading(true);
    promise.then((resp) => {
      const newFolderList = resp.data
        .filter((file) => !FileService.isFile(file))
        .map((folder) => {
          return prefix.sharedId ?
            { ...folder, name: parseFolderName(folder.name), selected: false } :
            { ...folder, selected: false };
        });
      setFolderList(newFolderList);

    }).catch(() => {
      setFolderList([]);

    }).finally(() => {
      setOnloading(false);
    });
  }, [userProfile, listPrefix, prefix, parseFolderName]);

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
    moveFiles(prefix, targetPrefix, filenames, userProfile.token).then(() => {
      moveFilesNext();
    }).catch((error) => {
      if (error.status === ApiResult.Duplicate) {
        dispatch(addMessage(
          intl(keys.moveFileDuplicate),
          MessageType.warning,
        ));

      } else if (error.status === ApiResult.PermissionDenied) {
        dispatch(addMessage(
          intl(keys.permissionDenied, IntlType.perUpper),
          MessageType.warning,
        ));
      }
    });

    dispatch(removeDialog());
  };

  const showBack2PreLayer = (): boolean => {
    if (prefix.sharedId) {
      return !(listPrefix.split('/').length === 2);
    }

    return listPrefix ? true : false;
  };

  const renderFolderList = () => {
    if (onLoading) {
      return <div><img className={styles.onLoading} src={loading} alt="onLoading"></img></div>;
    }

    return (
      <div className={styles.folderList}>
        {showBack2PreLayer() ?
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
