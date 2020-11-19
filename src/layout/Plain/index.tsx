import React, { FunctionComponent } from 'react';

import styles from './style.module.scss';

const Plain: FunctionComponent<{}> = ({ children }) => {
  return (
    <>
      <div id={styles.main}>
        {children}
      </div>
    </>
  );
}

export default Plain;