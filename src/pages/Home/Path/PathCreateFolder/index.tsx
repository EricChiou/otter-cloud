import React, { FunctionComponent, useState, useEffect, RefObject, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPrefix } from 'src/store/system.slice';

import { CreateFolder, Check } from 'src/components/icons';
import { BaseInput, BaseButton } from 'src/components/common/';

import styles from './style.module.scss';

const PathCreateFolder: FunctionComponent<{}> = () => {
  const history = useHistory();
  const prefix = useSelector(selectPrefix);
  const createFolderRef: RefObject<HTMLSpanElement> = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  let inputValue = '';

  const createOnClick = () => {
    setIsCreating(true);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!isCreating) { return; }

      let ele: HTMLElement | null = e.target as HTMLElement;
      while (ele) {
        if (ele.className === styles.createFolder) {
          return;
        }
        ele = ele.parentElement;
      }
      setIsCreating(false);
    }

    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isCreating]);

  const createOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') { return; }

    createFolder();
  };

  const createOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    inputValue = e.currentTarget.value;
  };

  const createFolder = (e?: MouseEvent) => {
    if (e) { e.stopPropagation(); }
    if (!inputValue) { return; }

    const search = prefix + inputValue + '/';
    history.push({
      pathname: history.location.pathname,
      search: search ? `?prefix=${encodeURIComponent(search)}` : '',
    });
    setIsCreating(false);
  }

  return (
    <span ref={createFolderRef} className={styles.createFolder} onClick={createOnClick}>
      {isCreating ?
        <div className={styles.createInput}>
          <BaseInput onFocus={true} onChange={createOnChange} onKeyUp={createOnKeyUp}></BaseInput>
          <BaseButton style={{ height: '23px' }} onClick={createFolder}>
            <Check></Check>
          </BaseButton>
        </div>
        :
        <CreateFolder></CreateFolder>
      }
    </span>
  );
};

export default PathCreateFolder;
