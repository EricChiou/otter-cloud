import React, { FunctionComponent, useRef, RefObject, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { More, Delete, Share, Warning } from 'src/components/icons';
import { File } from '../';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { intl, keys } from 'src/i18n';

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
  }

  const deleteFile = () => {
    console.log('Delete File', file);
    dispatch(removeDialog());
  };

  return (
    <span className={styles.fileOption} ref={optionEle}>
      <More onClick={showOptionOnClick}></More>
      {showOptions ?
        <div className={styles.options}>
          {(file.contentType && file.size) ? <Share></Share> : null}
          <Delete onClick={showDeleteWarning}></Delete>
        </div>
        : null
      }
    </span >
  );
};

export default FileOption;
