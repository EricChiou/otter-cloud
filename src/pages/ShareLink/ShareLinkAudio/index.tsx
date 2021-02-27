import React, { FunctionComponent, useEffect, useState } from 'react';

import { ShareableFile } from '..';
import { getObjectByShareableLinkUrl } from 'src/api/file';

import styles from './style.module.scss';

interface Props {
  shareableFile: ShareableFile;
  showLinkInvalidMessage: () => void;
}

const ShareLinkAudio: FunctionComponent<Props> = ({ shareableFile, showLinkInvalidMessage }) => {
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
    <div className={styles.shareLinkAudio}>
      <div className={'vert-align-mid'}></div>
      <audio className={styles.audio} src={url} controls>
        <source type="audio/mpeg" />
        <source type="audio/wav" />
        <source type="audio/ogg" />
      </audio>
    </div>
  );
};

export default ShareLinkAudio;
