import React, { FunctionComponent, useRef, RefObject } from 'react';

import { Upload, Download, Delete } from 'src/components/icons';

import styles from './style.module.scss';

interface Props {
  showDownload?: boolean;
  download?: () => void;
  del?: () => void;
}

const FileMenu: FunctionComponent<Props> = ({ showDownload, download, del }) => {
  const uploadInputEle: RefObject<HTMLInputElement> = useRef(null);

  const uploadOnClick = () => {
    uploadInputEle.current?.click();
  };

  const uploadFiles = () => {
    if (uploadInputEle.current && uploadInputEle.current.files) {
      const files: File[] = [];
      for (let i = 0; i < uploadInputEle.current.files.length; i++) {
        files.push(uploadInputEle.current.files[i]);
      }
      console.log('Upload Files', files);
      uploadInputEle.current.value = '';
    }
  };

  return (
    <div id={styles.fileMenu}>
      {showDownload ?
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
        <input ref={uploadInputEle} className={styles.uploadInput} type="file" multiple onChange={uploadFiles}></input>
      </div>
    </div>
  );
};

export default FileMenu;
