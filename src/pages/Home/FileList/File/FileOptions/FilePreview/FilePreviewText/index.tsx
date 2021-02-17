import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { File } from 'src/vo/common';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { getPreviewUrl } from 'src/api/file';
import TextFilePreview from 'src/components/TextFilePreview';
import loading from 'src/assets/img/loading2.gif';

import styles from './style.module.scss';

interface Props {
  file: File;
  close: () => void;
}

const FilePreviewText: FunctionComponent<Props> = ({ file, close }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [textBlob, setTextBlob] = useState<Blob | null>(null);
  const [percentage, setPercentage] = useState(0);

  const progress = useCallback((event: ProgressEvent<EventTarget>) => {
    if (!event.lengthComputable) { return; }

    const percentage = Math.round(event.loaded * 100 / event.total);
    setPercentage(percentage);
  }, []);

  useEffect(() => {
    getPreviewUrl(prefix, file.name, userProfile.token, progress).then((resp) => {
      setTextBlob(resp);
    });
  }, [file, prefix, userProfile, progress]);

  return (
    <div className={styles.preview} onClick={close}>
      {textBlob ?
        <TextFilePreview
          textBlob={textBlob}
          close={close}
        ></TextFilePreview> :
        <>
          <div className="vert-align-mid"></div>
          <img className={styles.onLoading} src={loading} alt="loading"></img>
          <div className={styles.progress}>{percentage}%</div>
        </>
      }
    </div>
  );
};

export default FilePreviewText;
