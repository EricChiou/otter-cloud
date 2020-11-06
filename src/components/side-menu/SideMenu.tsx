import React, { FunctionComponent, useRef, RefObject } from 'react';

import styles from './SideMenu.module.scss';

import { intl, keys, IntlType } from 'src/i18n';
import { Cloud } from 'src/components/icon';

const SideMenu: FunctionComponent<{}> = () => {
  const myCloudStorgeRef: RefObject<HTMLDivElement> = useRef(null);

  const onSelect = (ele: HTMLElement | null) => {
    if (!ele) { return; }

    myCloudStorgeRef.current?.classList.remove(styles.active);

    ele.classList.add(styles.active);
  }

  return (
    <div id={styles.sideMenu}>
      <div ref={myCloudStorgeRef} className={styles.option}>
        <div className={styles.content} onClick={() => { onSelect(myCloudStorgeRef.current); }}>
          <div className='vert-align-mid'></div>
          <span className={styles.icon}>
            <Cloud></Cloud>
          </span>
          <span className={styles.text}>{intl(keys.myCloudStorge, IntlType.perUpper)}</span>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;