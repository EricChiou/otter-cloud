import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import { Routes, ContentType } from 'src/constants';
import { intl, keys } from 'src/i18n';
import { addMessage, MessageType } from 'src/components/Message';
import ShareLinkDownload from './ShareLinkDownload';
import ShareLinkImage from './ShareLinkImage';
import ShareLinkAudio from './ShareLinkAudio';
import ShareLinkVideo from './ShareLinkVideo';

export interface Search {
  fileName: string;
  contentType: string;
  url: string;
};

const ShareLink: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [search, setSearch] = useState<Search>({
    fileName: '',
    contentType: '',
    url: '',
  });

  const showLinkInvalidMessage = useCallback(() => {
    dispatch(addMessage(intl(keys.shareableLinkInvalid,), MessageType.warning, () => {
      history.push(Routes.LOGIN);
    }));
  }, [dispatch, history]);

  useEffect(() => {
    try {
      const newSearch: { [key: string]: string } = {};
      location.search.slice(1).split('&').forEach((keyValueStr) => {
        const keyValue = keyValueStr.split('=');
        newSearch[keyValue[0]] = atob(keyValue[1]);
      });

      if (!newSearch.fileName || !newSearch.contentType || !newSearch.url) {
        showLinkInvalidMessage();
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
      showLinkInvalidMessage();
    }

  }, [location, search, showLinkInvalidMessage]);

  const renderShareLink = () => {
    if (!search.fileName || !search.contentType || !search.url) { return; }

    // console.log('renderShareLink', search);
    if (search.contentType.indexOf(ContentType.image) > -1) {
      return (
        <ShareLinkImage
          search={search}
          showLinkInvalidMessage={showLinkInvalidMessage}
        ></ShareLinkImage>
      );

    } else if (search.contentType.indexOf(ContentType.audio) > -1) {
      return (
        <ShareLinkAudio
          search={search}
          showLinkInvalidMessage={showLinkInvalidMessage}
        ></ShareLinkAudio>
      );

    } else if (search.contentType.indexOf(ContentType.video) > -1) {
      return (
        <ShareLinkVideo
          search={search}
          showLinkInvalidMessage={showLinkInvalidMessage}
        ></ShareLinkVideo>
      );
    }

    return (
      <ShareLinkDownload
        search={search}
        showLinkInvalidMessage={showLinkInvalidMessage}
      ></ShareLinkDownload>
    );
  };

  return (
    <div>{renderShareLink()}</div>
  );
};

export default ShareLink;
