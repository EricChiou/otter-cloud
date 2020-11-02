import React, { FunctionComponent, useEffect, useState } from 'react';

import { store } from '../../store/store';

import { Gear } from '../../components/common/index';

import styles from './Header.module.scss';
import logo from '../../assets/img/logo.png';

interface Props {
  fontSize?: number;
  showSetting?: boolean
}

const Header: FunctionComponent<Props> = ({ fontSize, showSetting = true }) => {
  const storeUser = store.getState().user;
  const [userProfile, setUserProfile] = useState(store.getState().user.profile);

  useEffect(() => {
    setUserProfile(store.getState().user.profile);
  }, [storeUser.profile])

  return (
    <div id={styles.header}>
      <img src={logo} alt="logo"></img>
      <span className={styles.name} style={{ fontSize: fontSize }}>Otter Cloud</span>
      {showSetting ? <>
        <div className={styles.setting}>
          <Gear color={'#fff'}></Gear>
        </div>
        <div className={styles.userInfo}>
          {userProfile.name}
        </div>
      </> : null
      }
    </div>
  );
};

export default Header;
