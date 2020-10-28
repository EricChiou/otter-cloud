import React, { FunctionComponent } from 'react';

import styles from './Header.module.scss';

import logo from '../../assets/img/logo.png';

interface Props {
  fontSize?: number;
}

const Header: FunctionComponent<Props> = ({ fontSize }: Props) => {
  return (
    <div id={styles.header}>
      <img src={logo} alt="logo"></img>
      <span className={styles.name} style={{ fontSize: fontSize }}>Otter Cloud</span>
    </div>
  );
};

export default Header;
