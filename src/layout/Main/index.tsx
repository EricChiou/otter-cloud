import React, { FunctionComponent, useEffect, useState } from 'react';

import styles from './style.module.scss';

import Header from 'src/components/Header';
import SideMenu from 'src/components/SideMenu';

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
    <div id={styles.main}>
      <div id={styles.header}>
        <Header fontSize={fontSize}></Header>
      </div>
      <div id={styles.sideMenu}>
        <SideMenu></SideMenu>
      </div>
      <div id={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Main;
