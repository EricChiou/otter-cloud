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
import { getSearch } from 'src/util/location.util';

export interface ShareableFile {
  fileName: string;
  contentType: string;
  url: string;
}

const ShareLink: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [shareableFile, setShareableFile] = useState<ShareableFile>({
    fileName: '',
    contentType: '',
    url: '',
  });

  const showLinkInvalidMessage = useCallback(() => {
    dispatch(addMessage(intl(keys.shareableLinkInvalid), MessageType.warning, () => {
      history.push({ pathname: Routes.LOGIN, search: '' });
    }));
  }, [dispatch, history]);

  useEffect(() => {
    try {
      const search = getSearch();

      if (!search.fileName || !search.contentType || !search.url) {
        showLinkInvalidMessage();
        return;
      }

      if (
        search.fileName !== shareableFile.fileName ||
        search.contentType !== shareableFile.contentType ||
        search.url !== shareableFile.url
      ) {
        setShareableFile({
          fileName: search.fileName,
          contentType: search.contentType,
          url: search.url,
        });
      }

    } catch (error) {
      showLinkInvalidMessage();
    }
  }, [location, shareableFile, showLinkInvalidMessage]);

  const renderShareLink = () => {
    if (!shareableFile.fileName || !shareableFile.contentType || !shareableFile.url) { return; }

    // console.log('renderShareLink', search);
    if (shareableFile.contentType.indexOf(ContentType.image) > -1) {
      return (
        <ShareLinkImage
          shareableFile={shareableFile}
          showLinkInvalidMessage={showLinkInvalidMessage}
        ></ShareLinkImage>
      );

    } else if (shareableFile.contentType.indexOf(ContentType.audio) > -1) {
      return (
        <ShareLinkAudio
          shareableFile={shareableFile}
          showLinkInvalidMessage={showLinkInvalidMessage}
        ></ShareLinkAudio>
      );

    } else if (shareableFile.contentType.indexOf(ContentType.video) > -1) {
      return (
        <ShareLinkVideo
          shareableFile={shareableFile}
          showLinkInvalidMessage={showLinkInvalidMessage}
        ></ShareLinkVideo>
      );
    }

    return (
      <ShareLinkDownload
        shareableFile={shareableFile}
        showLinkInvalidMessage={showLinkInvalidMessage}
      ></ShareLinkDownload>
    );
  };

  return (
    <div>{renderShareLink()}</div>
  );
};

export default ShareLink;
