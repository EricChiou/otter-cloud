import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { intl, keys, IntlType } from 'src/i18n';
import { logout } from 'src/store/user.slice';
import { Language, Logout } from 'src/components/icons';
import LangList from 'src/components/lang-list/LangList';

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
          <span className={styles.optionText}>{intl(keys.lang, IntlType.beginUpper)}</span>
        </li>
        <hr></hr>
        <li onClick={doLogout}>
          <div className={'vert-align-mid'}></div>
          <Logout></Logout>
          <span className={styles.optionText}>{intl(keys.logout, IntlType.beginUpper)}</span>
        </li>
      </ul>
      {showLangList ?
        <div className={styles.lang}>
          <LangList onSelect={() => { setShowLangList(false); }}></LangList>
        </div> : null
      }
    </div>
  );
};

export default Menu;
