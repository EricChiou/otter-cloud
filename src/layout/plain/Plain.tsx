import React, { FunctionComponent } from 'react';

import styles from './Plain.module.scss';

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