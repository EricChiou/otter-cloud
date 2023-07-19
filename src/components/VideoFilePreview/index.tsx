import React, { FunctionComponent, useEffect } from 'react';

import styles from './style.module.scss';

interface Props {
  url: string;
  close: () => void;
}

const VideoFilePreview: FunctionComponent<Props> = ({ url, close }) => {

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
      <div className={'vert-align-mid'}></div>
      <video
        className={styles.video}
        src={url}
        controls
        onClick={(e) => { e.stopPropagation(); }}
      ></video>
    </>
  );
};

export default VideoFilePreview;
