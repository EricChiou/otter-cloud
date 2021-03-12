import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { File } from 'src/interface/common';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { getPreviewUrl } from 'src/api/file';
import loading from 'src/assets/img/loading2.gif';

import styles from './style.module.scss';

interface Props {
  file: File;
  close: () => void;
}

const FilePreviewPdf: FunctionComponent<Props> = ({ file }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(0);

  const progress = useCallback((event: ProgressEvent<EventTarget>) => {
    if (!event.lengthComputable) { return; }

    const percentage = Math.round(event.loaded * 100 / event.total);
    setPercentage(percentage);
  }, []);

  useEffect(() => {
    getPreviewUrl(prefix, file.name, userProfile.token, progress).then((resp) => {
      const blob2File = new window.File([resp], file.name, { type: file.contentType });

      setPdfUrl(URL.createObjectURL(blob2File));
    });
  }, [file, prefix, userProfile, progress]);

  return (
    <div className={styles.preview}>
      {pdfUrl ?
        <embed
          type="application/pdf"
          src={pdfUrl}
          width={`${window.innerWidth}`}
          height={`${window.innerHeight}`}
        ></embed> :
        <>
          <div className="vert-align-mid"></div>
          <img className={styles.onLoading} src={loading} alt="loading"></img>
          <div className={styles.progress}>{percentage}%</div>
        </>
      }
    </div>
  );
};

export default FilePreviewPdf;
