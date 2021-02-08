import React, { FunctionComponent, useEffect, useState } from 'react';

import { Search } from '..';
import { getObjectByShareableLinkUrl } from 'src/api/file';

import styles from './style.module.scss';

interface Props {
  search: Search;
  showLinkInvalidMessage: () => void;
};

const ShareLinkVideo: FunctionComponent<Props> = ({ search, showLinkInvalidMessage }) => {
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