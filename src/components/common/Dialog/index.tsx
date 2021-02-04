import React, { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectBuffer, removeDialog } from './dialog.slice';
import { Close } from 'src/components/icons';

import styles from './style.module.scss';

export interface DialogData {
  component: JSX.Element;
  closeUI?: boolean;
  closeByClick?: boolean;
  defaultSize?: boolean;
  blockStyle?: object;
  callback?: () => void;
};

const Dialog: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const buffer = useSelector(selectBuffer);
  const [defaultSize, setDefaultSize] = useState(true);

  useEffect(() => {
    if (!buffer[0]) { return; }

    if (buffer[0].defaultSize === undefined) {
      if (!defaultSize) {
        setDefaultSize(true);
      }
    } else {
      if (buffer[0].defaultSize !== defaultSize) {
        setDefaultSize(buffer[0].defaultSize);
      }
    }

  }, [buffer, defaultSize]);

  const closeByClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (buffer.length && buffer[0].closeByClick) {
      close();
    }
  }

  const close = () => {
    if (buffer[0].callback) { buffer[0].callback(); }
    dispatch(removeDialog());
  }

  return (
    <>
      {buffer.length ?
        <div className={styles.dialog}>
          <div className={styles.mask} onClick={closeByClick}>
            <div
              className={`${styles.block}${defaultSize ? ` ${styles.defaultSize}` : ''}`}
              style={buffer[0].blockStyle}
              onClick={(e) => { e.stopPropagation(); }}
            >
              {buffer[0].component}
              {buffer[0].closeUI ?
                <div className={styles.close}>
                  <Close onClick={close}></Close>
                </div>
                : null
              }
            </div>
          </div>
        </div>
        : null
      }
    </>
  );
};

export { Dialog };
