import React, { FunctionComponent, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';

import { File } from 'src/vo/common';
import { getPreviewUrl } from 'src/api/file';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import loading from 'src/assets/img/loading2.gif';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FileNamePreviewImg: FunctionComponent<Props> = ({ file }: Props) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [url, setUrl] = useState('');
  const retry = useRef(0);
  const [percentage, setPercentage] = useState(0);
  const cancelToken = useRef<CancelTokenSource | null>(null);

  const progress = useCallback((event: ProgressEvent<EventTarget>) => {
    if (!event.lengthComputable) { return; }

    const percentage = Math.round(event.loaded * 100 / event.total);
    setPercentage(percentage);

  }, []);

  const getPreview = useCallback(() => {
    if (cancelToken.current) { cancelToken.current.cancel(); }
    cancelToken.current = axios.CancelToken.source();
    getPreviewUrl(
      prefix,
      file.name,
      userProfile.token,
      progress,
      cancelToken.current,
    ).then((resp) => {
      const urlCreator = window.URL || window.webkitURL;
      const url = urlCreator.createObjectURL(resp);
      setUrl(url);

    }).catch(
    ).finally(() => {
      retry.current += 1;
    });

  }, [file, prefix, userProfile, progress]);

  useEffect(() => {
    if (!url) {
      getPreview();
    }

    return () => {
      if (cancelToken.current) { cancelToken.current.cancel(); }
    };

  }, [url, getPreview]);

  const onError = () => {
    if (url && retry.current < 3) {
      setTimeout(() => {
        getPreview();
      }, 3000);
    }
  };

  return (
    <>
      {url ?
        <img
          className={styles.previewImage}
          src={url}
          alt="preview"
          onError={onError}
        ></img> :
        <>
          <img className={styles.onLoading} src={loading} alt="loading"></img>
          <div className={styles.percentage}>{percentage}%</div>
        </>
      }
    </>
  );
};

export default FileNamePreviewImg;
