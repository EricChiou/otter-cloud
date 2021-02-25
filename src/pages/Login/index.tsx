import React, { FunctionComponent, useState, useEffect, KeyboardEvent, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setUserProfile } from 'src/store/user.slice';
import { ApiResult, Routes } from 'src/constants';
import { intl, keys, IntlType } from 'src/i18n';
import { StatusService, UserService } from 'src/service';
import Header from 'src/components/Header';
import Lang from 'src/components/Lang';
import { BaseInput, BaseButton } from 'src/components/common';
import { login } from 'src/api/user';
import { addMessage, MessageType } from 'src/components/Message';

import styles from './style.module.scss';

const Login: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [className, setClassName] =
    useState(window.innerHeight > window.innerWidth ? styles.vertical : styles.horizontal);
  const onLoading = useRef(false);
  let acc = '';
  let pwd = '';

  useEffect(() => {
    if (StatusService.isLogin()) {
      history.push({ pathname: Routes.HOME, search: '' });
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
  });

  const doLogin = () => {
    if (onLoading.current) { return; }

    onLoading.current = true;
    login(acc, pwd).then((resp) => {
      // console.log('login:', resp);
      const userProfile = UserService.parseToken(resp.data.token);
      UserService.saveToken2Cookie(resp.data.token, userProfile.exp);
      setUserProfile(userProfile);

      history.push({ pathname: Routes.HOME, search: '' });

    }).catch((error) => {
      console.log(error);
      if (error.status === ApiResult.DataError) {
        dispatch(addMessage(intl(keys.signInErrorMsg, IntlType.perUpper), MessageType.info));

      } else if (error.status === ApiResult.AccInactive) {
        dispatch(addMessage(intl(keys.accInactive, IntlType.perUpper), MessageType.info));
      }

    }).finally(() => { onLoading.current = false; });
  };

  const accOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    acc = e.currentTarget.value;
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      doLogin();
    }
  };

  const pwdOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    pwd = e.currentTarget.value;
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      doLogin();
    }
  };

  return (
    <div id={styles.login} className={className}>
      <div className={styles.mask}></div>
      <div className={styles.loginBlock}>
        <div className={styles.header}>
          <Header fontSize={20} showSetting={false}></Header>
        </div>
        <div className={styles.input}>
          <span className={styles.title}>{intl(keys.email, IntlType.firstUpper)}:</span>
          <BaseInput
            placeholder={intl(keys.email)}
            style={{ padding: '2px 3px' }}
            onKeyUp={accOnKeyUp}
          ></BaseInput>
        </div>
        <div className={styles.input}>
          <span className={styles.title}>{intl(keys.password, IntlType.firstUpper)}:</span>
          <BaseInput
            type="password"
            placeholder={intl(keys.password)}
            style={{ padding: '2px 3px' }}
            onKeyUp={pwdOnKeyUp}
          ></BaseInput>
        </div>
        <div className={styles.loginBtn}>
          <BaseButton onClick={doLogin}>{intl(keys.login, IntlType.firstUpper)}</BaseButton>
        </div>
        <div
          className={styles.other}
          onClick={() => { history.push({ pathname: Routes.OTHER_LINK, search: '' }); }}
        >
          {intl(keys.other)}
        </div>
        <div
          className={styles.signUp}
          onClick={() => { history.push({ pathname: Routes.SIGN_UP, search: '' }); }}
        >
          {intl(keys.signUp)}
        </div>
      </div>
      <Lang></Lang>
    </div>
  );
};

export default Login;
