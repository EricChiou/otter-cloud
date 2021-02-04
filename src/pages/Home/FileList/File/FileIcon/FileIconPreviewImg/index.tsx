import React,
{
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
  MutableRefObject,
} from 'react';
import { useSelector } from 'react-redux';

import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { File } from 'src/vo/common';
import { getPreviewUrl } from 'src/api/file';
import { subFileShared, fileSharedActs } from 'src/shared/file-shared';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FileIconPreviewImg: FunctionComponent<Props> = ({ file }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [url, setUrl] = useState<string>();
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const onLoading: MutableRefObject<boolean> = useRef(false);

  const getPreview = useCallback(() => {
    onLoading.current = true;
    getPreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
      setUrl(resp.data.url);

    }).finally(() => {
      onLoading.current = false;
    });

  }, [prefix, userProfile, file]);

  useEffect(() => {
    const detectInViewport = () => {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && !url && !onLoading.current) {
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

  }, [url, getPreview]);

  const onError = () => {
    if (url) {
      getPreview();
    }
  };

  return (
    <img
      ref={imgRef}
      className={styles.previewImg}
      src={url}
      alt="preview"
      onError={onError}
    ></img>
  );
}

export default FileIconPreviewImg;