import React, { FunctionComponent } from 'react';

import Path from './Path';
import FileList from './FileList';
import TaskList from 'src/components/TaskList';

import styles from './style.module.scss';

const Home: FunctionComponent<{}> = () => {
  return (
    <div id={styles.home}>
      <Path></Path>
      <div className={styles.bottomLine}></div>
      <FileList></FileList>
      <TaskList></TaskList>
    </div>
  );
};

export default Home;

