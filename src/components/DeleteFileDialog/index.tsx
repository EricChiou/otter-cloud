import React, { FunctionComponent } from 'react';

import { intl, keys, IntlType } from 'src/i18n';
import { Warning } from 'src/components/icons';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';

import styles from './style.module.scss';

interface Props {
  fileName: string;
  confirm: () => void;
  cancel: () => void;
}

const DeleteFileDialog: FunctionComponent<Props> = ({ fileName, confirm, cancel }) => {
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
        <div className={styles.fileName}>{fileName}</div>
        {intl(keys.checkToDelete)}
        <br></br>
        {intl(keys.cannotUndone)}
      </div>
      <BaseButton type={ButtonType.danger} style={buttonStyle} onClick={confirm}>
        {intl(keys.delete, IntlType.perUpper)}
      </BaseButton>
      &nbsp;
      <BaseButton style={buttonStyle} onClick={cancel}>
        {intl(keys.cancel, IntlType.perUpper)}
      </BaseButton>
    </div >
  );
};

export default DeleteFileDialog;
