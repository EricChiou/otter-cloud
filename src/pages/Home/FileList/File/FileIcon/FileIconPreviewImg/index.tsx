import React,
{
  FunctionComponent,
  useEffect,
  useRef,
  useCallback,
  RefObject,
} from 'react';
import { useSelector } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';

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

const FileIconPreviewImg: FunctionComponent<Props> = ({ file }: Props) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const url = useRef('');
  const onLoading = useRef(false);
  const retry = useRef(0);
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const cancelToken = useRef<CancelTokenSource | null>(null);

  const setOnLoading = (isOnloading: boolean) => {
    onLoading.current = isOnloading;

    if (imgRef.current) {
      if (isOnloading) {
        imgRef.current.src = loading;
        imgRef.current.classList.add(styles.onLoading);

      } else {
        imgRef.current.classList.remove(styles.onLoading);
      }
    }
  };

  const getPreview = useCallback(() => {
    setOnLoading(true);

    if (cancelToken.current) { cancelToken.current.cancel(); }
    cancelToken.current = axios.CancelToken.source();
    getPreviewUrl(
      prefix.path,
      file.name,
      userProfile.token,
      undefined,
      cancelToken.current,
    ).then((resp) => {
      const urlCreator = window.URL || window.webkitURL;
      url.current = urlCreator.createObjectURL(resp);

    }).catch(() => {
      url.current = '';

    }).finally(() => {
      retry.current += 1;
      if (imgRef.current) { imgRef.current.src = url.current; }
      setOnLoading(false);
    });

  }, [prefix, userProfile, file]);

  useEffect(() => {
    const detectInViewport = () => {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && !url.current && !onLoading.current) {
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

  }, [getPreview]);

  const onError = () => {
    if (url.current && !onLoading.current && retry.current < 3) {
      getPreview();
    }
  };

  return (
    <img
      ref={imgRef}
      className={styles.previewImg}
      alt="preview"
      onError={onError}
    ></img>
  );
};

export default FileIconPreviewImg;
