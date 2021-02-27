/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FunctionComponent,
  useRef,
  RefObject,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Upload,
  Download,
  Delete,
  Move,
  UploadFile as UploadFileIcon,
  UploadFolder,
} from 'src/components/icons';
import { FileService, UploadFile } from 'src/service';
import { removeFileNext } from 'src/shared/file-shared';
import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix, selectFileList } from 'src/store/system.slice';
import { addDialog, removeDialog } from 'src/components/common';
import { removeFile } from 'src/api/file';
import DeleteFileDialog from 'src/components/DeleteFileDialog';
import MoveFile from './MoveFile';
import { ApiResult } from 'src/constants';
import { addMessage, MessageType } from 'src/components/Message';
import { intl, keys, IntlType } from 'src/i18n';

import styles from './style.module.scss';

interface Props {
  showOtherOptions?: boolean;
}

const FileListMenu: FunctionComponent<Props> = ({ showOtherOptions }) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);
  const fileList = useSelector(selectFileList);
  const uploadInputEle: RefObject<HTMLInputElement> = useRef(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  useEffect(() => {
    if (!showUploadOptions) { return; }

    const onClick = (e: MouseEvent) => {
      let ele: HTMLElement | null = e.target as HTMLElement;
      while (ele) {
        if (ele.className === styles.upload) {
          return;
        }
        ele = ele.parentElement;
      }

      setShowUploadOptions(false);
    };
    window.addEventListener('click', onClick);

    return () => { window.removeEventListener('click', onClick); };
  }, [showUploadOptions]);

  const showMoveFileDialog = () => {
    dispatch(addDialog({
      component: <MoveFile></MoveFile>,
      closeUI: true,
    }));
  };

  const uploadFileOnClick = () => {
    if (!uploadInputEle.current) { return; }

    uploadInputEle.current.removeAttribute('directory');
    uploadInputEle.current.removeAttribute('webkitdirectory');
    uploadInputEle.current.removeAttribute('mozdirectory');
    uploadInputEle.current?.click();
  };

  const uploadFolderOnClick = () => {
    if (!uploadInputEle.current) { return; }

    uploadInputEle.current.setAttribute('directory', '');
    uploadInputEle.current.setAttribute('webkitdirectory', '');
    uploadInputEle.current.setAttribute('mozdirectory', '');
    uploadInputEle.current?.click();
  };

  const doUploadFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadFileList = Array.from(e.target.files).map((file): UploadFile => {
        return {
          file,
          path: prefix.path,
        };
      });
      FileService.uploadFiles(prefix, uploadFileList);
    }
  };

  const showDeleteWarning = () => {
    const confirm = () => {
      dispatch(removeDialog());

      const files = fileList.filter((file) => file.selected);
      const removeAllFiles = files
        .map((file) => removeFile(prefix, file.name, userProfile.token));

      Promise.all(removeAllFiles)
        .then(() => { removeFileNext(); })
        .catch((error) => {
          if (error.status && error.status === ApiResult.PermissionDenied) {
            dispatch(addMessage(
              intl(keys.permissionDenied, IntlType.perUpper),
              MessageType.warning,
            ));
          }
        });
    };
    const cancel = () => { dispatch(removeDialog()); };

    let fileName = '';
    fileList.forEach((file) => {
      if (file.selected) {
        fileName += file.name + ', ';
      }
    });
    const component = (
      <DeleteFileDialog
        fileName={fileName.slice(0, -2)}
        confirm={confirm}
        cancel={cancel}
      ></DeleteFileDialog>
    );

    dispatch(addDialog({ component }));
  };

  return (
    <div id={styles.fileMenu}>
      {showOtherOptions ?
        <>
          <div className={styles.icon} onClick={showDeleteWarning}>
            <Delete></Delete>
          </div>
          <div
            className={styles.icon}
            onClick={() => { FileService.downloadFiles(prefix, fileList); }}
          >
            <Download></Download>
          </div>
          <div className={styles.icon} onClick={showMoveFileDialog}>
            <Move></Move>
          </div>
        </> : null
      }
      <div
        className={`${styles.icon} ${styles.upload}`}
        onClick={() => { setShowUploadOptions(!showUploadOptions); }}
      >
        <Upload></Upload>
        {showUploadOptions ?
          <div className={styles.subIconContainer}>
            <div className={styles.subIcon} onClick={uploadFolderOnClick}>
              <UploadFolder></UploadFolder>
            </div>
            <div className={styles.subIcon} onClick={uploadFileOnClick}>
              <UploadFileIcon></UploadFileIcon>
            </div>
          </div> : null
        }
        <input
          ref={uploadInputEle}
          className={styles.uploadInput}
          type="file"
          multiple
          onChange={doUploadFiles}
        ></input>
      </div>
    </div >
  );
};

export default FileListMenu;
