import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { File } from 'src/pages/Home/FileList/File';
import { ContentType } from 'src/constants/file';
import { Preview } from 'src/components/icons';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FilePreview: FunctionComponent<Props> = ({ file }) => {
  const dispatch = useDispatch();

  const previewFile = () => {
    const component = (
      <div className={styles.preview} onClick={() => { dispatch(removeDialog()); }}>
        <div className={"vert-align-mid"}></div>
        <img
          src={"https://dummyimage.com/1920X1080/000/fff"}
          alt="preview"
          onClick={(e) => { e.stopPropagation(); }}
        ></img>
      </div>
    );

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

    } else if (file.contentType.indexOf(ContentType.text) > -1) {
      return null;

    } else if (file.contentType.indexOf(ContentType.image) > -1) {
      return <Preview onClick={previewFile}></Preview>

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
  }

  return <>{renderPreviewOption()}</>;
}

export default FilePreview;
