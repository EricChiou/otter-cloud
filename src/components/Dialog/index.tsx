import React, { FunctionComponent, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectBuffer, removeDialog } from './dialog.slice';
import { Close } from 'src/components/icons';

import styles from './style.module.scss';

export interface DialogData {
  component: JSX.Element;
  closeUI?: boolean;
  closeByClick?: boolean;
}

const Dialog: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const buffer = useSelector(selectBuffer);

  const closeByClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (buffer.length && buffer[0].closeByClick) {
      close();
    }
  }

  const close = () => {
    dispatch(removeDialog());
  }

  return (
    <>
      {buffer.length ?
        <div className={styles.dialog}>
          <div className={styles.mask} onClick={closeByClick}>
            <div className={styles.block} onClick={(e) => { e.stopPropagation(); }}>
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

export default Dialog;
