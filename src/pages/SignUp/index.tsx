import React, { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Header from 'src/components/Header';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseInput, BaseButton, ButtonType } from 'src/components/common';
import Lang from 'src/components/Lang';
import { Routes, ApiResult } from 'src/constants';
import { CheckCircle, ErrorCircle } from 'src/components/icons';
import { signUp } from 'src/api/user';
import { addMessage, MessageType } from 'src/components/Message';

import styles from './style.module.scss';

const SignUp: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [className, setClassName] =
    useState(window.innerHeight > window.innerWidth ? styles.vertical : styles.horizontal);
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const inputStyle = { width: '252px' };
  const btnStyle = { width: '75px' };

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

  const doSignUp = () => {
    signUp(userData.email, userData.name, userData.password).then((resp) => {
      console.log(resp);
      if (resp.status === ApiResult.Success) {
        dispatch(addMessage(
          intl(keys.signUpSuccess),
          MessageType.info,
          () => { history.push({ pathname: Routes.LOGIN, search: '' }); },
        ));
      } else if (resp.status === ApiResult.Duplicate) {
        dispatch(addMessage(intl(keys.signUpDuplicate), MessageType.warning));
      } else {
        dispatch(addMessage(intl(keys.signUpFail), MessageType.error));
      }

    }).catch(() => {
      dispatch(addMessage(intl(keys.signUpFail), MessageType.error));
    });
  };

  const checkUserData = (): boolean => {
    if (!userData.email) { return false; }
    if (!userData.name) { return false; }
    if (!userData.password) { return false; }
    if (!userData.confirmPassword) { return false; }
    if (userData.password !== userData.confirmPassword) { return false; }

    return true;
  };

  const checkPassword = (): boolean | null => {
    if (!userData.password || !userData.confirmPassword) {
      return null;
    }

    if (userData.password === userData.confirmPassword) {
      return true;

    } else {
      return false;
    }
  };

  const eMailOnChange = (e: ChangeEvent<HTMLInputElement> | null, value: string) => {
    const newUserData = { ...userData };
    newUserData.email = e ? e.target.value : value;
    setUserData(newUserData);
  };

  const nameOnChange = (e: ChangeEvent<HTMLInputElement> | null, value: string) => {
    const newUserData = { ...userData };
    newUserData.name = e ? e.target.value : value;
    setUserData(newUserData);
  };

  const pwdOnChange = (e: ChangeEvent<HTMLInputElement> | null, value: string) => {
    const newUserData = { ...userData };
    newUserData.password = e ? e.target.value : value;
    setUserData(newUserData);
  };

  const confirmPwdOnChange = (e: ChangeEvent<HTMLInputElement> | null, value: string) => {
    const newUserData = { ...userData };
    newUserData.confirmPassword = e ? e.target.value : value;
    setUserData(newUserData);
  };

  return (
    <div id={styles.signUp} className={className}>
      <div className={styles.mask}></div>
      <div className="vert-align-mid"></div>
      <div className={styles.signUpBlock}>
        <div className={styles.header}><Header fontSize={20} showSetting={false}></Header></div>
        <div className={styles.title}>{intl(keys.signUp, IntlType.upper)}</div>
        <div className={styles.infoBlock}>
          <span className={styles.info}>
            <div className={styles.infoTitle}>{intl(keys.email, IntlType.perUpper)}:</div>
            <BaseInput style={inputStyle} onChange={eMailOnChange}></BaseInput>
          </span>
          <span className={styles.info}>
            <div className={styles.infoTitle}>{intl(keys.name, IntlType.perUpper)}:</div>
            <BaseInput style={inputStyle} onChange={nameOnChange}></BaseInput>
          </span>
          <span className={styles.info}>
            <div className={`${styles.infoTitle} ${checkPassword() ? styles.ok : styles.error}`}>
              {intl(keys.password, IntlType.perUpper)}:
              {checkPassword() !== null ?
                (checkPassword() ? <CheckCircle></CheckCircle> : <ErrorCircle></ErrorCircle>) : null
              }
            </div>
            <BaseInput type={'password'} style={inputStyle} onChange={pwdOnChange}></BaseInput>
          </span>
          <span className={styles.info}>
            <div className={`${styles.infoTitle} ${checkPassword() ? styles.ok : styles.error}`}>
              {intl(keys.confirmPwd, IntlType.perUpper)}:
              {checkPassword() !== null ?
                (checkPassword() ? <CheckCircle></CheckCircle> : <ErrorCircle></ErrorCircle>) : null
              }
            </div>
            <BaseInput
              type={'password'}
              style={inputStyle}
              onChange={confirmPwdOnChange}
            ></BaseInput>
          </span>
        </div>
        <div className={styles.confirm}>
          <div className={styles.confirmBtn}>
            <BaseButton
              style={btnStyle}
              disabled={!checkUserData()}
              onClick={doSignUp}
            >
              {intl(keys.signUp, IntlType.perUpper)}
            </BaseButton>
          </div>
          <div className={styles.confirmBtn}>
            <BaseButton
              type={ButtonType.normal}
              style={btnStyle}
              onClick={() => { history.push({ pathname: Routes.LOGIN, search: '' }); }}
            >
              {intl(keys.cancel, IntlType.perUpper)}
            </BaseButton>
          </div>
        </div>
      </div>
      <Lang></Lang>
    </div >
  );
};

export default SignUp;
