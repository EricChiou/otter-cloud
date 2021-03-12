import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { File } from 'src/interface/common';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { getOfficeFilePreviewUrl } from 'src/api/file';
import loading from 'src/assets/img/loading2.gif';
import { previewFileUrl, previewOfficeFileUrl } from 'src/constants/file';

import styles from './style.module.scss';

interface Props {
  file: File;
  close: () => void;
}

const FilePreviewOffice: FunctionComponent<Props> = ({ file, close }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(0);

  const progress = useCallback((event: ProgressEvent<EventTarget>) => {
    if (!event.lengthComputable) { return; }

    const percentage = Math.round(event.loaded * 100 / event.total);
    setPercentage(percentage);
  }, []);

  useEffect(() => {
    getOfficeFilePreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
      // console.log(resp);
      setPreviewUrl(`${previewFileUrl}?url=${resp.data.url}`);
    });
  }, [file, prefix, userProfile, progress]);

  return (
    <div className={styles.preview} onClick={close}>
      {previewUrl ?
        <iframe
          title="preview-excel"
          src={`${previewOfficeFileUrl}?src=${previewUrl}`}
          width={`${window.innerWidth}`}
          height={`${window.innerHeight}`}
        >
          This is an embedded
           <a href="http://office.com" target="_blank" rel="noreferrer noopener">
            Microsoft Office
          </a>
          document, powered by
          <a href="http://office.com/webapps" target="_blank" rel="noreferrer noopener">
            Office Online
          </a>.
        </iframe > :
        <>
          <div className="vert-align-mid"></div>
          <img className={styles.onLoading} src={loading} alt="loading"></img>
          <div className={styles.progress}>{percentage}%</div>
        </>
      }
    </div>
  );
};

export default FilePreviewOffice;
