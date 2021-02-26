import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { intl, keys, IntlType } from 'src/i18n';
import { logout } from 'src/store/user.slice';
import { Language, Logout, Person } from 'src/components/icons';
import LangList from 'src/components/LangList';
import { selectUserProfile } from 'src/store/user.slice';
import { addDialog } from 'src/components/common';
import SettingDialog from 'src/components/SettingDialog';

import styles from './style.module.scss';

interface Props {
  close: () => void;
}

const Menu: FunctionComponent<Props> = ({ close }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
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

      close();
    };
    window.addEventListener('click', onClick);

    return () => { window.removeEventListener('click', onClick); };
  });

  const doLogout = () => {
    dispatch(logout());
  };

  const showPersonalSettingsDialog = () => {
    dispatch(addDialog({
      component: <SettingDialog></SettingDialog>,
      closeUI: true,
      closeByClick: false,
      defaultSize: false,
      blockStyle: {
        marginTop: 'calc(50vh - 220px)',
        width: '300px',
        height: '435px',
      },
    }));

    close();
  };

  return (
    <div className={styles.menu}>
      <ul>
        {window.innerWidth < 480 ?
          <>
            <li className={styles.userName}>{userProfile.name}</li>
            <hr></hr>
          </> : null
        }
        <li onClick={showPersonalSettingsDialog}>
          <div className={'vert-align-mid'}></div>
          <Person></Person>
          <span className={styles.optionText}>
            {intl(keys.personalSettings, IntlType.perUpper)}
          </span>
        </li>
        <hr></hr>
        <li onClick={() => { setShowLangList(!showLangList); }}>
          <div className={'vert-align-mid'}></div>
          <Language></Language>
          <span className={styles.optionText}>{intl(keys.lang, IntlType.firstUpper)}</span>
        </li>
        <hr></hr>
        <li onClick={doLogout}>
          <div className={'vert-align-mid'}></div>
          <Logout></Logout>
          <span className={styles.optionText}>{intl(keys.logout, IntlType.firstUpper)}</span>
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
