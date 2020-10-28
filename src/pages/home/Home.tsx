import React, { FunctionComponent } from 'react';

// import styles from './Home.module.scss';

import { store } from '../../store/store';

const Home: FunctionComponent<{}> = () => {
  console.log('userProfile:', store.getState().userProfile);

  return (
    <div>Home Page</div>
  );
};

export default Home;

