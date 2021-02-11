import React,
{
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
} from 'react';
import { useSelector } from 'react-redux';

import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { File } from 'src/vo/common';
import { getPreviewUrl } from 'src/api/file';
import { subFileShared, fileSharedActs } from 'src/shared/file-shared';

import loading from 'src/assets/img/loading.gif';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FileIconPreviewImg: FunctionComponent<Props> = ({ file }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [url, setUrl] = useState<string>();
  const [retry, setRetry] = useState(0);
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const [onLoading, setOnloading] = useState(false);

  const getPreview = useCallback(() => {
    setOnloading(true);
    getPreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
      const urlCreator = window.URL || window.webkitURL;
      const url = urlCreator.createObjectURL(resp);
      setUrl(url);

    }).finally(() => {
      setRetry(retry + 1);
      setOnloading(false);
    });

  }, [prefix, userProfile, file, retry]);

  useEffect(() => {
    const detectInViewport = () => {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && !url && !onLoading) {
          getPreview();
        }
      }
    };

    detectInViewport();
    const subscribe = subFileShared((data) => {
      if (data.action === fileSharedActs.fileListOnScroll) {
        detectInViewport();
      }
    });

    return () => { subscribe.unsubscribe(); };

  }, [url, getPreview, onLoading]);

  const onError = () => {
    if (url && !onLoading && retry < 3) {
      getPreview();
    }
  };

  return (
    <>
      {onLoading ?
        <img className={styles.onLoading} src={loading} alt="loading"></img> :
        <img
          ref={imgRef}
          className={styles.previewImg}
          src={url}
          alt="preview"
          onError={onError}
        ></img>
      }
    </>
  );
}

export default FileIconPreviewImg;
