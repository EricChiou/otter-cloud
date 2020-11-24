import React, { FunctionComponent } from 'react';

import Path from './Path';
import FileList from './FileList';
import HomeMenu from './HomeMenu';

import styles from './style.module.scss';

const Home: FunctionComponent<{}> = () => {
  return (
    <div id={styles.home}>
      <Path></Path>
      <FileList></FileList>
      <HomeMenu></HomeMenu>
    </div>
  );
};

export default Home;

