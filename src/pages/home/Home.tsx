import React, { FunctionComponent, useEffect } from 'react';
import { useSelector } from 'react-redux';

// import styles from './Home.module.scss';

import { selectUserProfile } from '../../store/user.slice';

const Home: FunctionComponent<{}> = () => {
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    console.log('userProfile:', userProfile);
  }, [userProfile]);

  return (
    <div>Home Page</div>
  );
};

export default Home;

