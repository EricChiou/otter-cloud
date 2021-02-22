import React, { FunctionComponent, useRef, RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Upload, Download, Delete, Move } from 'src/components/icons';
import { FileService } from 'src/service';
import { removeFileNext } from 'src/shared/file-shared';
import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix, selectFileList } from 'src/store/system.slice';
import { addDialog, removeDialog } from 'src/components/common';
import { removeFile } from 'src/api/file';
import DeleteFileDialog from 'src/components/DeleteFileDialog';
import MoveFile from './MoveFile';

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

  const showMoveFileDialog = () => {
    dispatch(addDialog({
      component: <MoveFile></MoveFile>,
      closeUI: true,
    }));
  };

  const uploadOnClick = () => {
    uploadInputEle.current?.click();
  };

  const doUploadFiles = () => {
    if (uploadInputEle.current) {
      if (uploadInputEle.current.files && uploadInputEle.current.files.length) {
        FileService.uploadFiles(prefix, uploadInputEle.current.files);
        uploadInputEle.current.value = '';
      }
    }
  };

  const showDeleteWarning = () => {
    const confirm = () => {
      dispatch(removeDialog());

      const files = fileList.filter((file) => file.selected);
      const removeAllFiles = files
        .map((file) => removeFile(prefix.path, file.name, userProfile.token));

      Promise.all(removeAllFiles).then(() => { removeFileNext(); });
    };
    const cancel = () => { dispatch(removeDialog()); };

    const component = <DeleteFileDialog confirm={confirm} cancel={cancel}></DeleteFileDialog>;

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
      <div className={styles.icon}>
        <Upload onClick={uploadOnClick}></Upload>
        <input
          ref={uploadInputEle}
          className={styles.uploadInput}
          type="file"
          multiple
          onChange={doUploadFiles}
        ></input>
      </div>
    </div>
  );
};

export default FileListMenu;
