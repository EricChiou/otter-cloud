import React, { FunctionComponent, useEffect } from 'react';

import styles from './style.module.scss';

interface Props {
  url: string;
  close: () => void;
}

const ImageFilePreview: FunctionComponent<Props> = ({ url, close }) => {

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keyup', onKeyPress);

    return () => { window.removeEventListener('keyup', onKeyPress); };

  }, [close]);

  return (
    <>
      <div className={"vert-align-mid"}></div>
      <img
        className={styles.img}
        src={url}
        alt="preview"
        onClick={(e) => { e.stopPropagation(); }}
      ></img>
    </>
  );
};

export default ImageFilePreview;
