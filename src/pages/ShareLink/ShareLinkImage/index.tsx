import React, { FunctionComponent, useEffect, useState } from 'react';

import { Search } from '../';
import { getObjectByShareableLinkUrl } from 'src/api/file';

import styles from './style.module.scss';

interface Props {
  search: Search;
  showLinkInvalidMessage: () => void;
};

const ShareLinkImage: FunctionComponent<Props> = ({ search, showLinkInvalidMessage }) => {
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
    <div className={styles.shareLinkImage}>
      <div className={'vert-align-mid'}></div>
      <img className={styles.img} src={url} alt="shareable-link" />
    </div>
  );
};

export default ShareLinkImage;
