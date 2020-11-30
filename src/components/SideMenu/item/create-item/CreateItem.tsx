import React, { FunctionComponent, KeyboardEvent } from 'react';

import { BaseInput } from 'src/components/common';

import styles from '../Item.module.scss';

interface Props {
  CreateItemIcon?: FunctionComponent;
  createItem?: (itemName: string) => void;
}

const CreateItem: FunctionComponent<Props> = ({ CreateItemIcon, createItem }) => {
  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!createItem || e.key !== 'Enter' || !e.currentTarget.value) { return; }

    createItem(e.currentTarget.value);
    e.currentTarget.value = '';
  };

  return (
    <div className={styles.subItem}>
      <div className='vert-align-mid'></div>
      <span className={styles.icon}>
        {CreateItemIcon ? <CreateItemIcon></CreateItemIcon> : null}
      </span>
      <span className={styles.text}>
        <BaseInput style={{ width: 'calc(100% - 8px)' }} onKeyUp={onKeyUp}></BaseInput>
      </span>
    </div>
  );
}

export default CreateItem;