import React, { FunctionComponent, useEffect } from 'react';

import { Search } from '../';
import { getObjectByShareableLinkUrl } from 'src/api/file';

interface Props {
  search: Search;
  showLinkInvalidMessage: () => void;
};

const ShareLinkDownload: FunctionComponent<Props> = ({ search, showLinkInvalidMessage }) => {
  useEffect(() => {
    // console.log(search);
    getObjectByShareableLinkUrl(search.url).then((resp) => {
      const url = URL.createObjectURL(new Blob([resp], { type: search.contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.download = search.fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      URL.revokeObjectURL(url);

    }).catch(() => {
      showLinkInvalidMessage();
    });

  }, [search, showLinkInvalidMessage]);

  return <></>;
};

export default ShareLinkDownload;
