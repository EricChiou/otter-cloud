import React, { FunctionComponent, useRef, RefObject, useEffect, useState } from 'react';

import { More } from 'src/components/icons';
import { File } from 'src/vo/common';
import FileRename from './FileRename';
import FileShare from './FileShare';
import FileDelete from './FileDelete';
import FilePreview from './FilePreview';
import { ViewType } from '../../';
import { ContentType } from 'src/constants';
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
      };
    };
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  });

  const getOptionsClassName = (): string => {
    switch (viewType) {
      case ViewType.list:
        return styles.options;

      case ViewType.icon:
        return styles.iconOptions;
    }
  }

  const getOptionsStyle = (): Object => {
    switch (viewType) {
      case ViewType.list:
        return {};

      case ViewType.icon:
        if (!FileService.isFile(file)) {
          return { width: '26px' };

        } else if (file.contentType.indexOf(ContentType.text) > -1) {
          return { width: '104px' };

        } else if (file.contentType.indexOf(ContentType.image) > -1) {
          return { width: '104px' };

        } else if (file.contentType.indexOf(ContentType.audio) > -1) {
          return { width: '78px' };

        } else if (file.contentType.indexOf(ContentType.video) > -1) {
          return { width: '78px' };

        } else if (file.contentType.indexOf(ContentType.zip) > -1) {
          return { width: '78px' };

        } else if (file.contentType.indexOf(ContentType.pdf) > -1) {
          return { width: '78px' };

        } else if (file.contentType.indexOf(ContentType.word) > -1) {
          return { width: '78px' };

        } else if (file.contentType.indexOf(ContentType.excel) > -1) {
          return { width: '78px' };

        } else if (file.contentType.indexOf(ContentType.ppt) > -1) {
          return { width: '78px' };
        }
        return { width: '78px' };
    }
  }

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
          <FileDelete file={file} onClick={optionOnClick}></FileDelete>
        </div>
        : null
      }
    </span >
  );
};

export default FileOptions;
