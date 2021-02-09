import React, { FunctionComponent } from 'react';
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
    getPreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
      const urlCreator = window.URL || window.webkitURL;
      const url = urlCreator.createObjectURL(resp);

      const component = (
        <div className={styles.preview} onClick={() => { dispatch(removeDialog()); }}>
          <ImageFilePreview
            url={url}
            close={() => { dispatch(removeDialog()); }}
          ></ImageFilePreview>
        </div>
      );

      showPreviewDialog(component);
    });

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
    if (file.contentType === '') {
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
