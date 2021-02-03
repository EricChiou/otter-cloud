import React, { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Routes } from 'src/constants';
import { getObjectByShareableLinkUrl } from 'src/api/file';

const ShareLink: FunctionComponent<{}> = () => {
  const history = useHistory();
  const location = useLocation();
  const [search, setSearch] = useState<{ [key: string]: string }>({
    fileName: '',
    contentType: '',
    url: '',
  });

  useEffect(() => {
    try {
      const newSearch: { [key: string]: string } = {};
      location.search.slice(1).split('&').forEach((keyValueStr) => {
        const keyValue = keyValueStr.split('=');
        newSearch[keyValue[0]] = keyValue[1];
      });

      if (!newSearch.fileName || !newSearch.contentType || !newSearch.url) {
        history.push(Routes.LOGIN);
        return;
      }

      if (
        newSearch.fileName !== search.fileName ||
        newSearch.contentType !== search.contentType ||
        newSearch.url !== search.url
      ) {
        setSearch({
          fileName: newSearch.fileName,
          contentType: newSearch.contentType,
          url: newSearch.url
        });
      }

    } catch (error) {
      history.push(Routes.LOGIN);
    }

  }, [location, history, search]);

  useEffect(() => {
    if (!search.fileName || !search.contentType || !search.url) { return; }

    console.log(search);
    getObjectByShareableLinkUrl(search.url).then((resp) => {
      const url = URL.createObjectURL(new Blob([resp], { type: atob(search.contentType) }));
      const link = document.createElement('a');
      link.href = url;
      link.download = atob(search.fileName);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      URL.revokeObjectURL(url);

    }).catch(() => {
      history.push(Routes.LOGIN);
    });

  }, [search]);

  return (
    <div></div>
  );
};

export default ShareLink;
