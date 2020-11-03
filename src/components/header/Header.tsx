import React, { FunctionComponent, useEffect, useState } from 'react';

import { store } from '../../store/store';

import { Gear } from '../../components/common/index';

import Menu from './menu/Menu';

import styles from './Header.module.scss';
import logo from '../../assets/img/logo.png';

interface Props {
  fontSize?: number;
  showSetting?: boolean
}

const Header: FunctionComponent<Props> = ({ fontSize, showSetting = true }) => {
  const storeUser = store.getState().user;
  const [userProfile, setUserProfile] = useState(store.getState().user.profile);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setUserProfile(store.getState().user.profile);
  }, [storeUser.profile]);

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
              <Menu></Menu>
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
