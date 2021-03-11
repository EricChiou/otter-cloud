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

const FilePreviewPdf: FunctionComponent<Props> = ({ file, close }) => {
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
    <div className={styles.preview} onClick={close}>
      {pdfUrl ?
        <iframe
          title="preview-excel"
          src={'https://view.officeapps.live.com/op/embed.aspx?src=https://www.calicomoomoo.ml/file/%E9%82%B1%E7%B9%BC%E5%BE%B7%E5%85%88%E7%94%9F(%E5%B9%B4%E5%AD%983400%E5%85%83%E7%BE%8E%E9%87%91%E5%B7%A6%E5%8F%B3%E9%A0%90%E7%AE%97%2020%E5%B9%B4%E6%9C%9F).xls'}
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

export default FilePreviewPdf;
