import React, { ChangeEvent, FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { Item } from '../';
import { selectUserProfile } from 'src/store/user.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseInput, BaseButton, ButtonType, BaseTooltip } from 'src/components/common';
import { Add, Cancel } from 'src/components/icons';
import { addSharedFolder } from 'src/api/share';

import styles from './style.module.scss';

interface Props {
  item: Item;
  close: () => void;
}

const ShareFolderDialog: FunctionComponent<Props> = ({ item }) => {
  const userProfile = useSelector(selectUserProfile);
  let sharedAcc = '';

  const doAddSharedFolder = () => {
    addSharedFolder(sharedAcc, item.data.prefix, 'read', userProfile.token).then((resp) => {
      console.log(resp);
    }).catch((error) => {
      console.log(error);
    });
  };

  const shareToOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    sharedAcc = e.target.value;
  };

  return (
    <div className={styles.shareFolder}>
      <div className={styles.header}>{intl(keys.shareFolder, IntlType.perUpper)}</div>
      <div className={styles.target}>{item.name}</div>
      <div className={styles.shareTo}>
        {intl(keys.shareTo, IntlType.perUpper)}：<br />
        <BaseInput
          style={{ width: 'calc(100% - 36px)', height: '22px', verticalAlign: 'middle' }}
          placeholder={intl(keys.account, IntlType.perUpper)}
          onChange={shareToOnChange}
        ></BaseInput>
        <BaseButton
          style={{ padding: '0', verticalAlign: 'middle' }}
          onClick={doAddSharedFolder}>
          <Add></Add>
        </BaseButton>
      </div>
      <div className={styles.shared}>
        {intl(keys.shared, IntlType.perUpper)}：<br />
        <div className={styles.sharedList}>
          <BaseTooltip content={'name, acc'}>
            <div className={styles.sharedBlock}>
              <span className={styles.sharedName}>name, acc</span>
              <BaseButton
                style={{ padding: '0', verticalAlign: 'middle' }}
                type={ButtonType.danger}
              >
                <Cancel></Cancel>
              </BaseButton>
            </div>
          </BaseTooltip>
        </div>
      </div>
    </div>
  );
};

export default ShareFolderDialog;
