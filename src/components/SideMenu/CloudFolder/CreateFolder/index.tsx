import React, { FunctionComponent, KeyboardEvent } from 'react';

import { BaseInput } from 'src/components/common';
import { CreateFolder as CreateFolderIcon } from 'src/components/icons';

import styles from '../style.module.scss';

interface Props {
  createFolder: (folderName: string) => void;
}

const CreateFolder: FunctionComponent<Props> = ({ createFolder }: Props) => {
  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !e.currentTarget.value) { return; }

    createFolder(e.currentTarget.value);
    e.currentTarget.value = '';
  };

  return (
    <div className={styles.folder}>
      <div className='vert-align-mid'></div>
      <span className={styles.icon}>
        <CreateFolderIcon></CreateFolderIcon>
      </span>
      <span className={styles.text}>
        <BaseInput style={{ width: 'calc(100% - 8px)' }} onKeyUp={onKeyUp}></BaseInput>
      </span>
    </div>
  );
};

export default CreateFolder;