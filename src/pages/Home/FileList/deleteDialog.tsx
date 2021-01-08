import React from 'react';

import { intl, keys, IntlType } from 'src/i18n';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { Warning } from 'src/components/icons';

import styles from './style.module.scss';

export default (del: () => void, cancel: () => void): JSX.Element => {
  const buttonStyle = {
    width: '80px',
    textAlign: 'center',
  };

  return (
    <div className={styles.delete}>
      <div className={styles.icon}>
        <Warning></Warning>
      </div>
      <div className={styles.text}>
        {intl(keys.checkToDelete)}
        <br></br>
        {intl(keys.cannotUndone)}
      </div>
      <BaseButton type={ButtonType.danger} style={buttonStyle} onClick={del}>
        {intl(keys.delete, IntlType.firstUpper)}
      </BaseButton>
          &nbsp;&nbsp;
      <BaseButton style={buttonStyle} onClick={cancel} >
        {intl(keys.cancel, IntlType.firstUpper)}
      </BaseButton>
    </div>
  )
};
