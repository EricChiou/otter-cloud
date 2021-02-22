import React, { FunctionComponent, useEffect } from 'react';

import { ShareableFile } from '../';
import { getObjectByShareableLinkUrl } from 'src/api/file';

interface Props {
  shareableFile: ShareableFile;
  showLinkInvalidMessage: () => void;
}

const ShareLinkDownload: FunctionComponent<Props> = ({ shareableFile, showLinkInvalidMessage }) => {
  useEffect(() => {
    // console.log(search);
    getObjectByShareableLinkUrl(shareableFile.url).then((resp) => {
      const url = URL.createObjectURL(new Blob([resp], { type: shareableFile.contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.download = shareableFile.fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      URL.revokeObjectURL(url);

    }).catch(() => {
      showLinkInvalidMessage();
    });

  }, [shareableFile, showLinkInvalidMessage]);

  return <></>;
};

export default ShareLinkDownload;
