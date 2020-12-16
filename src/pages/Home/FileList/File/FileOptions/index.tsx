import React, { FunctionComponent, useRef, RefObject, useEffect, useState } from 'react';

import { More } from 'src/components/icons';
import { File } from 'src/pages/Home/FileList/File';
import FileShare from './FileShare';
import FileDelete from './FileDelete';
import FilePreview from './FilePreview';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FileOptions: FunctionComponent<Props> = ({ file }) => {
  const optionEle: RefObject<HTMLSpanElement> = useRef(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const onClick = (e: Event) => {
      let ele: HTMLElement | null = e.target as HTMLElement;
      while (ele) {
        if (ele === optionEle.current) {
          return;
        }
        ele = ele.parentElement;
      }

      if (showOptions) {
        setShowOptions(false)
      };
    };
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  });

  const showOptionOnClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <span className={styles.fileOption} ref={optionEle}>
      <More onClick={showOptionOnClick}></More>
      {showOptions ?
        <div className={styles.options}>
          <FilePreview file={file}></FilePreview>
          <FileShare file={file}></FileShare>
          <FileDelete file={file}></FileDelete>
        </div>
        : null
      }
    </span >
  );
};

export default FileOptions;
