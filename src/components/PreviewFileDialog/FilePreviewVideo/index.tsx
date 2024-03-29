import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { File } from 'src/interface/common';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { getVideoPreview } from 'src/api/file';
import VideoFilePreview from 'src/components/VideoFilePreview';
import loading from 'src/assets/img/loading2.gif';

import styles from './style.module.scss';

interface Props {
  file: File;
  close: () => void;
}

const FilePreviewImg: FunctionComponent<Props> = ({ file, close }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [url, setUrl] = useState('');
  const [percentage, setPercentage] = useState(0);

  const progress = useCallback((event: ProgressEvent<EventTarget>) => {
    if (!event.lengthComputable) { return; }

    const percentage = Math.round(event.loaded * 100 / event.total);
    setPercentage(percentage);
  }, []);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    getVideoPreview(
      prefix,
      file.name,
      userProfile.token,
      progress,
    ).then((resp) => {
      const videoBlob = new Blob([resp], { type: 'video/mp4' });
      const urlCreator = window.URL || window.webkitURL;
      setUrl(urlCreator.createObjectURL(videoBlob));

    }).catch(() => {
      // do nothing
    });

    return () => { cancelToken.cancel(); };
  }, [file, prefix, userProfile, progress]);

  return (
    <div className={styles.preview} onClick={close}>
      {url ?
        <VideoFilePreview
          url={url}
          close={close}
        ></VideoFilePreview> :
        <>
          <div className="vert-align-mid"></div>
          <img className={styles.onLoading} src={loading} alt="loading"></img>
          <div className={styles.progress}>{percentage}%</div>
        </>
      }
    </div>
  );
};

export default FilePreviewImg;
