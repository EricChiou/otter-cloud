import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Header from 'src/components/Header';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseInput, BaseButton } from 'src/components/common';
import Lang from 'src/components/Lang';
import { GoBack } from 'src/components/icons';
import { Routes } from 'src/constants';
import { sendActivationCode, resetPwd } from 'src/api/user';
import { addMessage, MessageType } from 'src/components/Message';

import styles from './style.module.scss';

const Other: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [className, setClassName] =
    useState(window.innerHeight > window.innerWidth ? styles.vertical : styles.horizontal);
  const inputStyle = {
    marginBottom: '5px',
    width: '252px',
    height: '24px',
  };
  const onLoading = useRef(false);
  const [resetPwdAcc, setResetPwdAcc] = useState('');
  const [sendActivationCodeAcc, setSndActivationCodeAcc] = useState('');

  useEffect(() => {
    const onResize = () => {
      if (window.innerHeight > window.innerWidth) {
        if (className !== styles.vertical) {
          setClassName(styles.vertical);
        }
      } else if (window.innerWidth && className !== styles.horizontal) {
        setClassName(styles.horizontal);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  const doResetPwd = () => {
    if (!resetPwdAcc || onLoading.current) { return; }

    onLoading.current = true;
    resetPwd(resetPwdAcc).then(() => {
      dispatch(addMessage(
        intl(keys.resetPwdSuccess),
        MessageType.success,
        () => { history.push({ pathname: Routes.LOGIN, search: '' }); },
      ));

    }).catch(() => {
      dispatch(addMessage(intl(keys.resetPwdFail), MessageType.error));

    }).finally(() => { onLoading.current = false; });
  };

  const doSendActivationCode = () => {
    if (!sendActivationCodeAcc || onLoading.current) { return; }

    onLoading.current = true;
    sendActivationCode(sendActivationCodeAcc).then(() => {
      dispatch(addMessage(
        intl(keys.sendActiveCodeSuccess),
        MessageType.success,
        () => { history.push({ pathname: Routes.LOGIN, search: '' }); },
      ));

    }).catch(() => {
      dispatch(addMessage(intl(keys.sendActiveCodeSuccess), MessageType.error));

    }).finally(() => { onLoading.current = false; });
  };

  return (
    <div id={styles.other} className={className}>
      <div className={styles.mask}></div>
      <div className="vert-align-mid"></div>
      <div className={styles.otherBlock}>
        <div className={styles.header}>
          <Header fontSize={20} showSetting={false}></Header>
          <div
            className={styles.goBack}
            onClick={() => { history.push({ pathname: Routes.LOGIN, search: '' }); }}
          >
            <GoBack></GoBack>
          </div>
        </div>
        <div className={styles.title}>{intl(keys.forgetPwd, IntlType.perUpper)}</div>
        <div className={styles.infoBlock}>
          <span className={styles.info}>
            <BaseInput
              style={inputStyle}
              placeholder={intl(keys.email, IntlType.firstUpper)}
              onChange={(e, value) => { setResetPwdAcc(e ? e.target.value : value); }}
            ></BaseInput>
            <BaseButton disabled={!resetPwdAcc} onClick={doResetPwd}>
              {intl(keys.resetPwd, IntlType.perUpper)}
            </BaseButton>
          </span>
        </div>
        <div className={styles.title} style={{ marginTop: '12px' }}>
          {intl(keys.sendActiveCode, IntlType.perUpper)}
        </div>
        <div className={styles.infoBlock}>
          <span className={styles.info}>
            <BaseInput
              style={inputStyle}
              placeholder={intl(keys.email, IntlType.firstUpper)}
              onChange={(e, value) => { setSndActivationCodeAcc(e ? e.target.value : value); }}
            ></BaseInput>
            <BaseButton disabled={!sendActivationCodeAcc} onClick={doSendActivationCode}>
              {intl(keys.sendActiveCode, IntlType.perUpper)}
            </BaseButton>
          </span>
        </div>
      </div>
      <Lang></Lang>
    </div>
  );
};

export default Other;