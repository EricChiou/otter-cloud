import React, { ChangeEvent, FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { Item } from '..';
import { selectUserProfile } from 'src/store/user.slice';
import { selectSharedFolderList } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseInput, BaseButton, ButtonType, BaseTooltip, BaseSelect } from 'src/components/common';
import { Add, Cancel } from 'src/components/icons';
import { addSharedFolder } from 'src/api/shared';
import { sharedFolderPermsType } from 'src/constants';

import styles from './style.module.scss';

interface Props {
  item: Item;
  close: () => void;
}

const ShareFolderDialog: FunctionComponent<Props> = ({ item }) => {
  const sharedFolderList = useSelector(selectSharedFolderList);
  const userProfile = useSelector(selectUserProfile);
  let sharedAcc = '';
  let permission: string | sharedFolderPermsType = sharedFolderPermsType.read;
  const permissionOptions = [
    { label: intl(keys.canRead, IntlType.firstUpper), value: sharedFolderPermsType.read },
    { label: intl(keys.canWrite, IntlType.firstUpper), value: sharedFolderPermsType.write },
  ];

  const doAddSharedFolder = () => {
    if (!sharedAcc || !permission) { return; }

    addSharedFolder(sharedAcc, item.data.prefix, permission, userProfile.token).then((resp) => {
      console.log(resp);
    }).catch((error) => {
      console.log(error);
    });
  };

  const shareToOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    sharedAcc = e.target.value;
  };

  const renderShareFolderList = () => {
    return sharedFolderList
      .filter((sharedFolder) =>
        (sharedFolder.ownerAcc === userProfile.acc && sharedFolder.prefix === item.data.prefix))
      .map((sharedFolder) => {
        return (
          <BaseTooltip
            key={sharedFolder.id}
            content={`${sharedFolder.sharedName}, ${sharedFolder.sharedAcc}`}
          >
            <div className={styles.sharedBlock}>
              <span className={styles.sharedName}>
                {sharedFolder.sharedName}, {sharedFolder.sharedAcc}
              </span>
              <BaseButton
                style={{ padding: '0', verticalAlign: 'middle' }}
                type={ButtonType.danger}
              >
                <Cancel></Cancel>
              </BaseButton>
            </div>
          </BaseTooltip>
        );
      });
  };

  return (
    <div className={styles.shareFolder}>
      <div className={styles.header}>{intl(keys.shareFolder, IntlType.perUpper)}</div>
      <div className={styles.target}>{item.name}</div>
      <div className={styles.shareTo}>
        {intl(keys.shareTo, IntlType.perUpper)}：<br />
        <BaseInput
          style={{ width: 'calc(100% - 75px - 36px)', height: '22px', verticalAlign: 'middle' }}
          placeholder={intl(keys.account, IntlType.perUpper)}
          onChange={shareToOnChange}
        ></BaseInput>
        <BaseSelect
          style={{ width: '75px', height: '28px', verticalAlign: 'middle' }}
          // placeholder={intl(keys.permission, IntlType.firstUpper)}
          options={permissionOptions}
          defaultSelect={true}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => { permission = e.target.value; }}
        ></BaseSelect>
        <BaseButton
          style={{ padding: '0', verticalAlign: 'middle' }}
          onClick={doAddSharedFolder}>
          <Add></Add>
        </BaseButton>
      </div>
      <div className={styles.shared}>
        {intl(keys.shared, IntlType.perUpper)}：<br />
        <div className={styles.sharedList}>
          {renderShareFolderList()}
        </div>
      </div>
    </div>
  );
};

export default ShareFolderDialog;
