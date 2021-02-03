import React, { FunctionComponent, useRef, RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Upload, Download, Delete } from 'src/components/icons';
import { FileService } from 'src/service';
import { removeFileNext } from 'src/shared/file-shared';
import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix, selectFileList } from 'src/store/system.slice';
import { addDialog, removeDialog } from 'src/components/common';
import { removeFile } from 'src/api/file';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { intl, keys, IntlType } from 'src/i18n';
import { Warning } from 'src/components/icons';

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

  const uploadOnClick = () => {
    uploadInputEle.current?.click();
  };

  const doUploadFiles = () => {
    if (uploadInputEle.current && uploadInputEle.current.files) {
      const files: File[] = [];
      for (let i = 0; i < uploadInputEle.current.files.length; i++) {
        files.push(uploadInputEle.current.files[i]);
      }

      FileService.uploadFiles(prefix, uploadInputEle.current.files);
      uploadInputEle.current.value = '';
    }
  };

  const deleteDialog = (del: () => void, cancel: () => void): JSX.Element => {
    const buttonStyle = {
      width: '80px',
      textAlign: 'center',
    };

    return (
      <div className={styles.delete}>
        <div className={styles.icon}>
          <Warning></Warning>
        </div>
        <div className={styles.text}>
          {intl(keys.checkToDelete)}
          <br></br>
          {intl(keys.cannotUndone)}
        </div>
        <BaseButton type={ButtonType.danger} style={buttonStyle} onClick={del}>
          {intl(keys.delete, IntlType.firstUpper)}
        </BaseButton>
            &nbsp;&nbsp;
        <BaseButton style={buttonStyle} onClick={cancel} >
          {intl(keys.cancel, IntlType.firstUpper)}
        </BaseButton>
      </div>
    );
  };

  const showDeleteWarning = () => {
    const component = deleteDialog(
      () => {
        dispatch(removeDialog());

        const files = fileList.filter((file) => file.selected);
        files.forEach(async (file) => {
          await removeFile(prefix, file.name, userProfile.token);
        });

        removeFileNext();
      },
      () => { dispatch(removeDialog()); },
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
        </>
        : null
      }
      <div className={styles.icon}>
        <Upload onClick={uploadOnClick}></Upload>
        <input ref={uploadInputEle} className={styles.uploadInput} type="file" multiple onChange={doUploadFiles}></input>
      </div>
    </div>
  );
};

export default FileListMenu;
