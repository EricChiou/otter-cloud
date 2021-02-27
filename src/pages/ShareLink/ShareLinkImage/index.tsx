import React, { FunctionComponent, useEffect, useState } from 'react';

import { ShareableFile } from '../';
import { getObjectByShareableLinkUrl } from 'src/api/file';
import loading from 'src/assets/img/loading2.gif';

import styles from './style.module.scss';

interface Props {
  shareableFile: ShareableFile;
  showLinkInvalidMessage: () => void;
}

const ShareLinkImage: FunctionComponent<Props> = ({ shareableFile, showLinkInvalidMessage }) => {
  const [url, setUrl] = useState(loading);

  useEffect(() => {
    getObjectByShareableLinkUrl(shareableFile.url).then((resp) => {
      const url = URL.createObjectURL(new Blob([resp], { type: shareableFile.contentType }));
      setUrl(url);

    }).catch(() => {
      showLinkInvalidMessage();
    });
  }, [shareableFile, showLinkInvalidMessage]);

  return (
    <div className={styles.shareLinkImage}>
      <div className={'vert-align-mid'}></div>
      <img className={styles.img} src={url} alt="shareable-link" />
    </div>
  );
};

export default ShareLinkImage;
