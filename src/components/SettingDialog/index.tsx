import React, { FunctionComponent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setUserProfile, selectUserProfile } from 'src/store/user.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseTooltip, BaseInput, BaseButton } from 'src/components/common';
import { updateUser } from 'src/api/user';
import { addMessage, MessageType } from 'src/components/Message';

import styles from './style.module.scss';
import { ApiResult } from 'src/constants';

const SettingDialog: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const [name, setName] = useState(userProfile.name);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const onLoading = useRef(false);
  const pwdInputStyle = { width: 'calc(100% - 8px)', height: '26px' };

  const doModifyName = () => {
    if (onLoading.current) { return; }

    onLoading.current = true;
    updateUser({ name }, userProfile.token).then(() => {
      const msg = intl(keys.modifySuccess, IntlType.perUpper);
      dispatch(addMessage(msg, MessageType.success));

      const newUserProfile = { ...userProfile };
      newUserProfile.name = name;
      dispatch(setUserProfile(newUserProfile));

    }).catch(() => {
      const msg = intl(keys.modifyFail);
      dispatch(addMessage(msg, MessageType.warning));

    }).finally(() => {
      onLoading.current = false;
    });
  };

  const doResetPwd = () => {
    if (onLoading.current) { return; }

    updateUser({ oldPwd, newPwd }, userProfile.token).then(() => {
      const msg = intl(keys.modifySuccess, IntlType.perUpper);
      dispatch(addMessage(msg, MessageType.success));

    }).catch((error) => {
      if (error.status === ApiResult.DataError) {
        const msg = intl(keys.pwdError, IntlType.perUpper);
        dispatch(addMessage(msg, MessageType.warning));

      } else {
        const msg = intl(keys.modifyFail);
        dispatch(addMessage(msg, MessageType.warning));
      }

    }).finally(() => {
      onLoading.current = false;
    });
  };

  return (
    <div className={styles.setting}>
      <div className={styles.header}>{intl(keys.personalSettings, IntlType.perUpper)}</div>
      <div className={styles.body}>
        <div className={styles.bodyBlock}>
          <div className={styles.title}>{intl(keys.account, IntlType.perUpper)}：</div>
          <div className={styles.text}>
            <BaseTooltip content={userProfile.acc}>
              {userProfile.acc}
            </BaseTooltip>
          </div>
        </div>
        <div className={styles.bodyBlock}>
          <div className={styles.title}>{intl(keys.name, IntlType.perUpper)}：</div>
          <BaseInput
            style={{ width: 'calc(100% - 69px)', height: '26px', verticalAlign: 'middle' }}
            value={name}
            onChange={(e, value) => {
              const newName = (e ? e.target.value : value).trim();
              setName(newName ? newName : userProfile.name);
            }}
          ></BaseInput>
          <BaseButton
            style={{ width: '61px', height: '32px', verticalAlign: 'middle' }}
            onClick={doModifyName}
          >
            {intl(keys.modify, IntlType.perUpper)}
          </BaseButton>
        </div>
        <div className={styles.bodyBlock}>
          <div className={styles.title}>{intl(keys.password, IntlType.perUpper)}：</div>
          <div className={styles.content}>
            {intl(keys.oldPwd, IntlType.perUpper)}<br></br>
            <BaseInput
              type={'password'}
              style={pwdInputStyle}
              onChange={(e, value) => { setOldPwd(e ? e.target.value : value); }}
            ></BaseInput>
          </div>
          <div className={styles.content}>
            {intl(keys.newPwd, IntlType.perUpper)}<br></br>
            <BaseInput
              type={'password'}
              style={pwdInputStyle}
              onChange={(e, value) => { setNewPwd(e ? e.target.value : value); }}
            ></BaseInput>
          </div>
          <div className={styles.content}>
            {intl(keys.confirmPwd, IntlType.perUpper)}<br></br>
            <BaseInput
              type={'password'}
              style={pwdInputStyle}
              onChange={(e, value) => { setConfirmPwd(e ? e.target.value : value); }}
            ></BaseInput>
          </div>
          <div className={styles.content} style={{ textAlign: 'center' }}>
            <BaseButton
              disabled={!(oldPwd && newPwd && newPwd === confirmPwd)}
              onClick={doResetPwd}
            >
              {intl(keys.resetPwd, IntlType.perUpper)}
            </BaseButton>
          </div>
        </div>
      </div>
    </div >
  );
};

export default SettingDialog;
