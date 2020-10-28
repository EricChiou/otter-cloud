import React, { FunctionComponent, useEffect, useState } from 'react';

import styles from './Main.module.scss';

import Header from '../../components/header/Header';
import SideMenu from '../../components/side-menu/SideMenu';

const Main: FunctionComponent<{}> = ({ children }) => {
  const [fontSize, setFontSize] = useState(32);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        if (fontSize !== 32) {
          setFontSize(32);
        }
      } else if (window.innerWidth > 480) {
        if (fontSize !== 26) {
          setFontSize(26);
        }
      } else if (fontSize !== 18) {
        setFontSize(18);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return (
    <>
      <div id={styles.header}>
        <Header fontSize={fontSize}></Header>
      </div>
      <div id={styles.sideMenu}>
        <SideMenu></SideMenu>
      </div>
      <div id={styles.main}>
        {children}
      </div>
    </>
  );
}

export default Main;
