import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { File } from 'src/vo/common';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { getPreviewUrl } from 'src/api/file';
import ImageFilePreview from 'src/components/ImageFilePreview';
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
    getPreviewUrl(prefix.path, file.name, userProfile.token, progress, cancelToken).then((resp) => {
      const urlCreator = window.URL || window.webkitURL;
      setUrl(urlCreator.createObjectURL(resp));

    }).catch(() => {
      // do nothing
    });

    return () => { cancelToken.cancel(); };

  }, [file, prefix, userProfile, progress]);

  return (
    <div className={styles.preview} onClick={close}>
      {url ?
        <ImageFilePreview
          url={url}
          close={close}
        ></ImageFilePreview> :
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
