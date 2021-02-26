import React,
{
  FunctionComponent,
  useEffect,
  useRef,
  useCallback,
  RefObject,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';

import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { File } from 'src/interface/common';
import { getPreviewUrl } from 'src/api/file';
import { subFileShared, fileSharedActs } from 'src/shared/file-shared';

import loading from 'src/assets/img/loading.gif';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FileIconPreviewImg: FunctionComponent<Props> = ({ file }: Props) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [url, setUrl] = useState(loading);
  const onLoading = useRef(false);
  const retry = useRef(0);
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const cancelToken = useRef<CancelTokenSource | null>(null);

  const getPreview = useCallback(() => {
    if (onLoading.current) { return; }

    if (cancelToken.current) { cancelToken.current.cancel(); }
    cancelToken.current = axios.CancelToken.source();
    onLoading.current = true;
    getPreviewUrl(
      prefix,
      file.name,
      userProfile.token,
      undefined,
      cancelToken.current,
    ).then((resp) => {
      const urlCreator = window.URL || window.webkitURL;
      setUrl(urlCreator.createObjectURL(resp));

    }).catch(() => {
      setUrl('');

    }).finally(() => {
      retry.current += 1;
      onLoading.current = false;
    });

  }, [prefix, userProfile, file]);

  useEffect(() => {
    const detectInViewport = () => {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && url === loading && !onLoading.current) {
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

    return () => {
      subscribe.unsubscribe();
      if (cancelToken.current) { cancelToken.current.cancel(); }
    };

  }, [getPreview, url]);

  const onError = () => {
    if (url && !onLoading.current && retry.current < 3) {
      getPreview();
    }
  };

  return (
    <img
      src={url}
      ref={imgRef}
      className={styles.previewImg}
      style={url === loading ? { width: '20%', height: '20%' } : undefined}
      alt="preview"
      onError={onError}
    ></img>
  );
};

export default FileIconPreviewImg;
