import React, { FunctionComponent, useEffect, useState } from 'react';

import { ShareableFile } from '..';
import { getObjectByShareableLinkUrl } from 'src/api/file';

import styles from './style.module.scss';

interface Props {
  shareableFile: ShareableFile;
  showLinkInvalidMessage: () => void;
}

const ShareLinkVideo: FunctionComponent<Props> = ({ shareableFile, showLinkInvalidMessage }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    getObjectByShareableLinkUrl(shareableFile.url).then((resp) => {
      const url = URL.createObjectURL(new Blob([resp], { type: shareableFile.contentType }));
      setUrl(url);

    }).catch(() => {
      showLinkInvalidMessage();
    });
  }, [shareableFile, showLinkInvalidMessage]);

  return (
    <div className={styles.shareLinkVideo}>
      <div className={'vert-align-mid'}></div>
      <video className={styles.video} src={url} controls>
        <source type="video/mp4" />
        <source type="video/webm" />
        <source type="video/ogg" />
      </video>
    </div>
  );
};

export default ShareLinkVideo;
