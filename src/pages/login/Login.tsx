import React, { FunctionComponent, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { setUserProfile } from '../../store/user.slice';

import { Routes } from '../../constants';
import { intl, keys, IntlType } from '../../i18n';

import { StatusService, UserService } from '../../service';

import Header from '../../components/header/Header';
import Lang from './lang/Lang';
import { Input, Button } from '../../components/common';

import styles from './Login.module.scss';

const Login: FunctionComponent<{}> = () => {
  const history = useHistory();
  const [className, setClassName] = useState(styles.horizontal);

  useEffect(() => {
    if (StatusService.isLogin()) {
      history.push(Routes.HOME);
    }
  });

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
  })

  const login = () => {
    console.log('login');
    const fakeUserData = {
      id: 1,
      acc: 'UserAccount',
      name: 'UserName 使用者名稱',
      role: 'normal',
      exp: new Date().getTime() + (7 * 24 * 60 * 60 * 1000), // 7days
    };
    const jsonStr = JSON.stringify(fakeUserData);
    const fakeToken = `qazwsxedc.${btoa(encodeURIComponent(jsonStr))}.rfvtgbyhn`;

    const userProfile = UserService.parseToken(fakeToken);
    UserService.saveToken2Cookie(fakeToken, userProfile.exp);
    setUserProfile(userProfile);

    history.push(Routes.HOME);
  }

  return (
    <div id={styles.login} className={className}>
      <div className={styles.mask}></div>
      <div className={styles.loginBlock}>
        <div className={styles.header}>
          <Header fontSize={20} showSetting={false}></Header>
        </div>
        <div className={styles.input}>
          <span className={styles.title}>{intl(keys.acc, IntlType.preUpper)}:</span>
          <Input placeholder={intl(keys.account)} style={{ padding: '2px 3px' }}></Input>
        </div>
        <div className={styles.input}>
          <span className={styles.title}>{intl(keys.pwd, IntlType.preUpper)}:</span>
          <Input type="password" placeholder={intl(keys.password)} style={{ padding: '2px 3px' }}></Input>
        </div>
        <div className={styles.loginBtn}>
          <Button onClick={login}>{intl(keys.login, IntlType.preUpper)}</Button>
        </div>
        <div className={styles.signUp}>sign up</div>
      </div>
      <Lang></Lang>
    </div >
  );
}

export default Login;
