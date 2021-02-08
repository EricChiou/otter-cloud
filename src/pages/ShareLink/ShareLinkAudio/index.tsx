import React, { FunctionComponent, useEffect, useState } from 'react';

import { Search } from '..';
import { getObjectByShareableLinkUrl } from 'src/api/file';

import styles from './style.module.scss';

interface Props {
  search: Search;
  showLinkInvalidMessage: () => void;
};

const ShareLinkAudio: FunctionComponent<Props> = ({ search, showLinkInvalidMessage }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    getObjectByShareableLinkUrl(search.url).then((resp) => {
      const url = URL.createObjectURL(new Blob([resp], { type: search.contentType }));
      setUrl(url);

    }).catch(() => {
      showLinkInvalidMessage();
    });

  }, [search, showLinkInvalidMessage]);

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
