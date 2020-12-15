import React, { FunctionComponent, useRef, RefObject, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { More, Delete, Share, Warning, Preview } from 'src/components/icons';
import { File } from '../';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { intl, keys } from 'src/i18n';
import { ContentType } from 'src/constants/file';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FileOption: FunctionComponent<Props> = ({ file }) => {
  const dispatch = useDispatch();
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

  const showDeleteWarning = () => {
    const buttonStyle = {
      width: '80px',
      textAlign: 'center',
    };

    const component = (
      <div className={styles.delete}>
        <div className={styles.icon}>
          <Warning></Warning>
        </div>
        <div className={styles.text}>
          {intl(keys.checkToDelete)}
          <br></br>
          {intl(keys.cannotUndone)}
        </div>
        <BaseButton type={ButtonType.danger} style={buttonStyle} onClick={deleteFile}>Delete</BaseButton>
        &nbsp;&nbsp;
        <BaseButton onClick={() => { dispatch(removeDialog()); }} style={buttonStyle}>Cancel</BaseButton>
      </div>
    );
    dispatch(addDialog({ component }));
  };

  const deleteFile = () => {
    console.log('Delete File', file);
    dispatch(removeDialog());
  };

  const previewFile = () => {
    const component = (
      <div className={styles.preview} onClick={() => { dispatch(removeDialog()); }}>
        <div className={"vert-align-mid"}></div>
        <img
          src={"https://dummyimage.com/1920X1080/000/fff"}
          alt="preview"
          onClick={(e) => { e.stopPropagation(); }}
        ></img>
      </div>
    );

    dispatch(addDialog({
      component,
      closeUI: true,
      closeByClick: true,
      defaultSize: false,
      blockStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
    }));
  };

  const renderPreviewOption = () => {
    if (file.contentType === '') {

    } else if (file.contentType.indexOf(ContentType.text) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.image) > -1) {
      return <Preview onClick={previewFile}></Preview>

    } else if (file.contentType.indexOf(ContentType.audio) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.video) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.zip) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.pdf) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.word) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.excel) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.ppt) > -1) {
      return null;
    }
  };

  return (
    <span className={styles.fileOption} ref={optionEle}>
      <More onClick={showOptionOnClick}></More>
      {showOptions ?
        <div className={styles.options}>
          {renderPreviewOption()}
          {(file.contentType && file.size) ? <Share></Share> : null}
          <Delete onClick={showDeleteWarning}></Delete>
        </div>
        : null
      }
    </span >
  );
};

export default FileOption;
