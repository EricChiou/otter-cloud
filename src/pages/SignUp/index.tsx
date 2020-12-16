import React, { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';
import { useHistory } from "react-router-dom";

import Header from 'src/components/Header';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseInput, BaseButton, ButtonType } from 'src/components/common';
import Lang from 'src/components/Lang';
import { Routes } from 'src/constants';

import styles from './style.module.scss';

const SignUp: FunctionComponent<{}> = () => {
  const history = useHistory();
  const [className, setClassName] =
    useState(window.innerHeight > window.innerWidth ? styles.vertical : styles.horizontal);
  const inputStyle = {
    width: '252px',
  }
  const btnStyle = {
    width: '75px',
  }
  const userData = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  };

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

  const signUp = () => {
    console.log('Sign Up', userData);
  };

  const eMailOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    userData.email = e.target.value;
  }

  const nameOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    userData.name = e.target.value;
  }

  const pwdOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    userData.password = e.target.value;
  }

  const confirmPwdOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    userData.confirmPassword = e.target.value;
  }

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
            <div className={styles.infoTitle}>{intl(keys.pwd, IntlType.perUpper)}:</div>
            <BaseInput type={"password"} style={inputStyle} onChange={pwdOnChange}></BaseInput>
          </span>
          <span className={styles.info}>
            <div className={styles.infoTitle}>{intl(keys.confirmPwd, IntlType.perUpper)}:</div>
            <BaseInput type={"password"} style={inputStyle} onChange={confirmPwdOnChange}></BaseInput>
          </span>
        </div>
        <div className={styles.confirm}>
          <div className={styles.confirmBtn}>
            <BaseButton
              style={btnStyle}
              onClick={signUp}
            >
              {intl(keys.signUp, IntlType.perUpper)}
            </BaseButton>
          </div>
          <div className={styles.confirmBtn}>
            <BaseButton
              type={ButtonType.normal}
              style={btnStyle}
              onClick={() => { history.push(Routes.LOGIN); }}
            >
              {intl(keys.cancel, IntlType.perUpper)}
            </BaseButton>
          </div>
        </div>
      </div>
      <Lang></Lang>
    </div >
  );
}

export default SignUp;
