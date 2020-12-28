import React, { FunctionComponent, useRef, RefObject } from 'react';

import { Upload, Download, Delete } from 'src/components/icons';

import styles from './style.module.scss';

interface Props {
  showOtherOptions?: boolean;
  uploadFiles: (files: FileList) => void;
  download: () => void;
  del: () => void;
}

const FileListMenu: FunctionComponent<Props> = ({ showOtherOptions, uploadFiles, download, del }) => {
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

      uploadFiles(uploadInputEle.current.files);
      uploadInputEle.current.value = '';
    }
  };

  return (
    <div id={styles.fileMenu}>
      {showOtherOptions ?
        <>
          <div className={styles.icon} onClick={del}>
            <Delete></Delete>
          </div>
          <div className={styles.icon} onClick={download}>
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
