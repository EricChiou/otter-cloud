import React, { FunctionComponent, useState, useRef, RefObject } from 'react';

import { DeviceInfo, getDeviceInfo } from 'src/util/device-detector.util';

import styles from './style.module.scss';

interface Props {
  content: string | FunctionComponent | JSX.Element;
  style?: object;
  tooltipStyle?: object;
}

const BaseTooltip: FunctionComponent<Props> = ({ children, style, tooltipStyle, content }) => {
  const [show, setShow] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const toolTipRef: RefObject<HTMLDivElement> = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const clearCountDown = () => {
    const deviceInfo: DeviceInfo | null = getDeviceInfo();
    if (!deviceInfo || deviceInfo.mobile) { return; }

    if (countDown) { clearTimeout(countDown); }
    setShow(false);
  };

  const startCountDown = () => {
    const deviceInfo: DeviceInfo | null = getDeviceInfo();
    if (!deviceInfo || deviceInfo.mobile) { return; }

    clearCountDown();
    setCountDown(window.setTimeout(() => {
      if (toolTipRef.current) {
        const clientRect = toolTipRef.current.getBoundingClientRect();
        setPosition({
          top: clientRect.top + toolTipRef.current.clientHeight,
          left: clientRect.left + 5,
        });
      }

      setShow(true);
    }, 500));
  };

  return (
    <div
      ref={toolTipRef}
      className={styles.tooltip}
      style={style}
      onMouseEnter={startCountDown}
      onMouseLeave={clearCountDown}
    >
      {children}
      {show ?
        <div
          className={styles.dialog}
          style={{ top: position.top, left: position.left, ...tooltipStyle }}
        >{content}</div> : null
      }
    </div>
  );
};

export { BaseTooltip };
