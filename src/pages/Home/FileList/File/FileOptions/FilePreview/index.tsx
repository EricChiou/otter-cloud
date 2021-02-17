import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { File } from 'src/vo/common';
import { ContentType } from 'src/constants';
import { Preview } from 'src/components/icons';
import { addDialog, removeDialog } from 'src/components/common';
import { getPreviewUrl } from 'src/api/file';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import TextFilePreview from 'src/components/TextFilePreview';
import ImageFilePreview from 'src/components/ImageFilePreview';
import { FileService } from 'src/service';
import loading from 'src/assets/img/loading2.gif';

import styles from './style.module.scss';

interface Props {
  file: File;
  onClick: () => void;
}

const FilePreview: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);

  const previewText = () => {
    getPreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
      const component = (
        <div className={styles.preview} onClick={() => { dispatch(removeDialog()); }}>
          <TextFilePreview
            textBlob={resp}
            close={() => { dispatch(removeDialog()); }}
          ></TextFilePreview>
        </div>
      );

      showPreviewDialog(component);
    });

    if (onClick) { onClick(); }
  };

  const previewImg = () => {
    const Component: FunctionComponent<{}> = () => {
      const [url, setUrl] = useState('');
      const [percentage, setPercentage] = useState(0);

      const progress = useCallback((event: ProgressEvent<EventTarget>) => {
        if (!event.lengthComputable) { return; }

        const percentage = Math.round(event.loaded * 100 / event.total);
        setPercentage(percentage);
      }, []);

      useEffect(() => {
        getPreviewUrl(prefix, file.name, userProfile.token, progress).then((resp) => {
          const urlCreator = window.URL || window.webkitURL;
          setUrl(urlCreator.createObjectURL(resp));
        });
      }, []);

      return (
        <div className={styles.preview} onClick={() => { dispatch(removeDialog()); }}>
          {url ?
            <ImageFilePreview
              url={url}
              close={() => { dispatch(removeDialog()); }}
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

    showPreviewDialog(<Component></Component>);

    if (onClick) { onClick(); }
  };

  const showPreviewDialog = (component: JSX.Element) => {
    dispatch(addDialog({
      component,
      closeUI: true,
      closeByClick: true,
      defaultSize: false,
      blockStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
    }));
  };

  const renderPreviewOption = () => {
    if (!FileService.isFile(file)) {
      return null;

    } else if (file.contentType.indexOf(ContentType.text) > -1) {
      return <Preview onClick={previewText}></Preview>;

    } else if (file.contentType.indexOf(ContentType.image) > -1) {
      return <Preview onClick={previewImg}></Preview>

    } else if (file.contentType.indexOf(ContentType.audio) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.video) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.zip) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.pdf) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.word) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.excel) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.ppt) > -1) {
      return null;
    }

    return null;
  }

  return <>{renderPreviewOption()}</>;
}

export default FilePreview;
