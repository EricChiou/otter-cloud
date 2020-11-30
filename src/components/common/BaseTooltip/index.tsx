import React, { FunctionComponent, useState, useRef, MutableRefObject } from 'react';

import styles from './style.module.scss';

interface Props {
  content: any;
  style?: object;
  tooltipStyle?: object;
}

const BaseTooltip: FunctionComponent<Props> = ({ children, style, tooltipStyle, content }) => {
  const [show, setShow] = useState(false);
  const countDown: MutableRefObject<number | null> = useRef(null);

  const startCountDown = () => {
    clearCountDown();
    countDown.current = window.setTimeout(() => { setShow(true); }, 500);
  };

  const clearCountDown = () => {
    if (countDown.current) { clearTimeout(countDown.current); }
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
