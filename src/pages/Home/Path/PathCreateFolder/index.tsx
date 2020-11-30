import React, { FunctionComponent, useState, useEffect, RefObject, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPrefix, setPrefix } from 'src/store/system.slice';

import { CreateFolder, Check } from 'src/components/icons';
import { BaseInput, BaseButton } from 'src/components/common/';

import styles from './style.module.scss';

const PathCreateFolder: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
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
    if (e.key !== 'Enter' || !e.currentTarget.value) { return; }

    createFolder();
  };

  const createOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    inputValue = e.currentTarget.value;
  };

  const createFolder = () => {
    console.log(inputValue);

    dispatch(setPrefix(`${prefix}/${inputValue}`));
    setIsCreating(false);
  }

  return (
    <span ref={createFolderRef} className={styles.createFolder} onClick={createOnClick}>
      {isCreating ?
        <div className={styles.createInput}>
          <BaseInput onChange={createOnChange} onKeyUp={createOnKeyUp}></BaseInput>
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
