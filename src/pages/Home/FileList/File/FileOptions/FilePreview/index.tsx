import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { File } from 'src/interface/common';
import { ContentType } from 'src/constants';
import { Preview } from 'src/components/icons';
import { addDialog, removeDialog } from 'src/components/common';
import { FileService } from 'src/service';
import FilePreviewImg from './FilePreviewImg';
import FilePreviewText from './FilePreviewText';

interface Props {
  file: File;
  onClick: () => void;
}

const FilePreview: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();

  const previewText = () => {
    const component = (
      <FilePreviewText
        file={file}
        close={() => { dispatch(removeDialog()); }}
      ></FilePreviewText>
    );

    showPreviewDialog(component);

    if (onClick) { onClick(); }
  };

  const previewImg = () => {
    const component = (
      <FilePreviewImg
        file={file}
        close={() => { dispatch(removeDialog()); }}
      ></FilePreviewImg>
    );

    showPreviewDialog(component);
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
