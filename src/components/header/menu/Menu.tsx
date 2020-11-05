import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { intl, keys, IntlType } from '../../../i18n';
import { logout } from '../../../store/user.slice';
import { Language, Logout } from '../../../components/icon';
import Lang from './lang/Lang';

import styles from './Menu.module.scss';

interface Props {
  close?: () => void;
}

const Menu: FunctionComponent<Props> = ({ close }) => {
  const dispatch = useDispatch();
  const [showLangList, setShowLangList] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      let ele: HTMLElement | null = e.target as HTMLElement;
      while (ele) {
        console.log(ele.className);
        if (ele.className === styles.menu) {
          return;
        }

        ele = ele.parentElement;
      }

      if (close) { close(); }
    };
    window.addEventListener('click', onClick);

    return () => { window.removeEventListener('click', onClick) };
  });

  const doLogout = () => {
    dispatch(logout());
  }

  return (
    <div className={styles.menu}>
      <ul>
        <li onClick={() => { setShowLangList(!showLangList); }}>
          <div className={'vert-align-mid'}></div>
          <Language></Language>
          <span className={styles.optionText}>{intl(keys.lang, IntlType.preUpper)}</span>
        </li>
        <hr></hr>
        <li onClick={doLogout}>
          <div className={'vert-align-mid'}></div>
          <Logout></Logout>
          <span className={styles.optionText}>{intl(keys.logout, IntlType.preUpper)}</span>
        </li>
      </ul>
      {showLangList ? <Lang close={() => { setShowLangList(false); }}></Lang> : null}
    </div>
  );
};

export default Menu;
