import React, { FunctionComponent } from 'react';

// import { intl, keys, IntlType } from 'src/i18n';
import Path from './path/Path';
import FileList from './file-list/FileList';

import styles from './Home.module.scss';

const Home: FunctionComponent<{}> = () => {
  return (
    <div id={styles.home}>
      <Path></Path>
      <FileList></FileList>
    </div>
  );
};

export default Home;

