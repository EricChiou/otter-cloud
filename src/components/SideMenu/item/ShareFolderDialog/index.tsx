import React, { FunctionComponent } from 'react';

import { Item } from '../';
import { intl, keys, IntlType } from 'src/i18n';

import styles from './style.module.scss';

interface Props {
  item: Item;
  close: () => void;
}

const ShareFolderDialog: FunctionComponent<Props> = ({ item }) => {
  return (
    <div className={styles.shareFolder}>
      <div className={styles.header}>{intl(keys.shareFolder, IntlType.perUpper)}</div>
      {item.name}
    </div>
  );
};

export default ShareFolderDialog;
