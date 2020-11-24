import React, { FunctionComponent } from 'react';

import { AddCircle } from 'src/components/icons';

import styles from './style.module.scss';

const HomeMenu: FunctionComponent<{}> = () => {
  return (
    <div id={styles.homeMenu}>
      <div className={styles.icon}>
        <AddCircle></AddCircle>
      </div>
    </div>
  );
};

export default HomeMenu;
