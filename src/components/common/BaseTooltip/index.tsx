import React, { FunctionComponent, useState, useRef, RefObject, useEffect } from 'react';

import { getDeviceInfo } from 'src/util/device-detector.util';

import styles from './style.module.scss';

interface Props {
  content: string | FunctionComponent | JSX.Element;
  style?: object;
  tooltipStyle?: object;
}

const BaseTooltip: FunctionComponent<Props> = ({ children, style, tooltipStyle, content }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());
  const countDown = useRef<number | null>(null);
  const toolTipRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const onResize = () => { setDeviceInfo(getDeviceInfo()); };
    window.addEventListener('resize', onResize);

    return () => { window.removeEventListener('resize', onResize); };
  }, []);

  const clearCountDown = () => {
    if (countDown.current) {
      clearTimeout(countDown.current);
      countDown.current = null;
    }

    setShow(false);
  };

  const startCountDown = () => {
    clearCountDown();

    countDown.current = window.setTimeout(() => {
      if (toolTipRef.current) {
        const clientRect = toolTipRef.current.getBoundingClientRect();
        setPosition({
          top: clientRect.top + toolTipRef.current.clientHeight,
          left: clientRect.left,
        });
      }

      setShow(true);
    }, 500);
  };

  return (
    <>
      {deviceInfo && !deviceInfo.mobile ?
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
        </div> :
        <div style={style}>{children}</div>
      }
    </>
  );
};

export { BaseTooltip };
