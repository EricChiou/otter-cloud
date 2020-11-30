import React, { FunctionComponent } from 'react';

import { Upload } from 'src/components/icons';

import styles from './style.module.scss';

const HomeMenu: FunctionComponent<{}> = () => {
  return (
    <div id={styles.homeMenu}>
      <div className={styles.icon}>
        <Upload></Upload>
      </div>
    </div>
  );
};

export default HomeMenu;
