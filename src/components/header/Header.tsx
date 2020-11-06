import React, { FunctionComponent, useEffect, useState } from 'react';

import { store } from 'src/store/store';
import { Gear } from 'src/components/icon/Gear';
import Menu from './menu/Menu';

import styles from './Header.module.scss';
import logo from 'src/assets/img/logo.png';

interface Props {
  fontSize?: number;
  showSetting?: boolean
}

const Header: FunctionComponent<Props> = ({ fontSize, showSetting = true }) => {
  const userStore = store.getState().user;
  const [userProfile, setUserProfile] = useState(store.getState().user.profile);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setUserProfile(store.getState().user.profile);
  }, [userStore.profile]);

  const settingOnClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div id={styles.header}>
      <span className={styles.left}>
        <img src={logo} alt="logo"></img>
        <span className={styles.name} style={{ fontSize: fontSize }}>Otter Cloud</span>
      </span>
      <span className={styles.right}>
        <div className="vert-align-mid"></div>
        {showSetting ? <>
          <div className={styles.userInfo}>
            {userProfile.name}
          </div>
          <div className={styles.setting}>
            <div className={styles.icon} onClick={settingOnClick}>
              <Gear></Gear>
            </div>
            {showMenu ?
              <Menu close={settingOnClick}></Menu>
              : null
            }
          </div>
        </> : null
        }
      </span>
    </div>
  );
};

export default Header;
