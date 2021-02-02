import React, { FunctionComponent, useState } from 'react';

import { DeviceInfo, getDeviceInfo } from 'src/util/device-detector.util';

import styles from './style.module.scss';

interface Props {
  content: any;
  style?: object;
  tooltipStyle?: object;
}

const BaseTooltip: FunctionComponent<Props> = ({ children, style, tooltipStyle, content }) => {
  const [show, setShow] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null);

  const startCountDown = () => {
    const deviceInfo: DeviceInfo | null = getDeviceInfo();
    if (!deviceInfo || deviceInfo.mobile) { return; }

    clearCountDown();
    setCountDown(window.setTimeout(() => { setShow(true); }, 500));
  };

  const clearCountDown = () => {
    const deviceInfo: DeviceInfo | null = getDeviceInfo();
    if (!deviceInfo || deviceInfo.mobile) { return; }

    if (countDown) { clearTimeout(countDown); }
    setShow(false);
  };

  return (
    <div className={styles.tooltip} style={style} onMouseEnter={startCountDown}
      onMouseLeave={clearCountDown}>
      {children}
      {show ?
        <div className={styles.dialog} style={tooltipStyle}>{content}</div>
        : null
      }
    </div>
  );
};

export { BaseTooltip };
