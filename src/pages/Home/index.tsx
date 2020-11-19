import React, { FunctionComponent } from 'react';

import Path from './Path';
import FileList from './FileList';

import styles from './style.module.scss';

const Home: FunctionComponent<{}> = () => {
  return (
    <div id={styles.home}>
      <Path></Path>
      <FileList></FileList>
    </div>
  );
};

export default Home;

