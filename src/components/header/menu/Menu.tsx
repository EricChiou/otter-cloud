import React, { FunctionComponent } from 'react';

import { intl, keys } from '../../../i18n';

import styles from './Menu.module.scss';

const Menu: FunctionComponent<{}> = () => {
  return (
    <div className={styles.menu}>
      <ul>
        <li>{intl(keys.logout)}</li>
      </ul>
    </div>
  );
};

export default Menu;
