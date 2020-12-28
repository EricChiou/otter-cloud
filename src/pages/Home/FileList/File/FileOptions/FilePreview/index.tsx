import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { File } from 'src/pages/Home/FileList/File';
import { ContentType } from 'src/constants/file';
import { Preview } from 'src/components/icons';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';
import { getPreviewUrl } from 'src/api/file';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';

import styles from './style.module.scss';

interface Props {
  file: File;
  onClick: () => void;
}

const FilePreview: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);

  const previewFile = () => {
    getPreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
      const component = (
        <div className={styles.preview} onClick={() => { dispatch(removeDialog()); }}>
          <div className={"vert-align-mid"}></div>
          <img
            src={resp.data.url}
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
    });

    if (onClick) { onClick(); }
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
