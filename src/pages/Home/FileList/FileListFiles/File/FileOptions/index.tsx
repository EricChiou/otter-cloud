import React, { FunctionComponent, useRef, RefObject, useEffect, useState } from 'react';

import { More } from 'src/components/icons';
import { File } from 'src/interface/common';
import FileRename from './FileRename';
import FileShare from './FileShare';
import FileDelete from './FileDelete';
import FilePreview from './FilePreview';
import FolderShare from './FolderShare';
import { ViewType } from '../../..';
import { FileService } from 'src/service';

import styles from './style.module.scss';

interface Props {
  file: File;
  viewType: ViewType;
}

const FileOptions: FunctionComponent<Props> = ({ file, viewType }) => {
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
        setShowOptions(false);
      }
    };
    window.addEventListener('click', onClick);

    return () => { window.removeEventListener('click', onClick); };
  }, [showOptions]);

  const getOptionsClassName = (): string => {
    switch (viewType) {
      case ViewType.list:
        return styles.options;

      case ViewType.icon:
        return styles.iconOptions;
    }
  };

  const getOptionsStyle = (): object => {
    const fileType = FileService.getFileType(file.contentType, file.size);
    switch (viewType) {
      case ViewType.list:
        return {};

      case ViewType.icon:
        switch (true) {
          case fileType.isText:
          case fileType.isImage:
          case fileType.isPdf:
          case fileType.isExcel:
            return { width: '104px' };

          case fileType.isAudio:
          case fileType.isVideo:
          case fileType.isZip:
          case fileType.isWord:
          case fileType.isPpt:
            return { width: '78px' };

          case !fileType.isFile:
            return { width: '52px' };
        }
        return { width: '78px' };
    }
  };

  const showOptionOnClick = () => {
    setShowOptions(!showOptions);
  };

  const optionOnClick = () => {
    setShowOptions(false);
  };

  return (
    <span className={styles.fileOption} ref={optionEle}>
      <More onClick={showOptionOnClick}></More>
      {showOptions ?
        <div className={getOptionsClassName()} style={getOptionsStyle()}>
          <FileRename file={file} onClick={optionOnClick}></FileRename>
          <FilePreview file={file} onClick={optionOnClick}></FilePreview>
          <FileShare file={file} onClick={optionOnClick}></FileShare>
          <FolderShare file={file} onClick={optionOnClick}></FolderShare>
          <FileDelete file={file} onClick={optionOnClick}></FileDelete>
        </div> : null
      }
    </span >
  );
};

export default FileOptions;
