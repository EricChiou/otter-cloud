import React from 'react';

import { AppThunk } from 'src/store/store';
import { addDialog, removeDialog } from 'src/components/common';
import { FileService } from 'src/service/file.service';
import { File } from 'src/interface/common';
import FilePreviewImg from './FilePreviewImg';
import FilePreviewText from './FilePreviewText';
import FilePreviewPdf from './FilePreviewPdf';
import FilePreviewExcel from './FilePreviewExcel';

const getComponent = (file: File, close: () => void) => {
  const fileType = FileService.getFileType(file.contentType, file.size);

  switch (true) {
    case fileType.isText:
      return (
        <FilePreviewText
          file={file}
          close={close}
        ></FilePreviewText>
      );
    case fileType.isImage:
      return (
        <FilePreviewImg
          file={file}
          close={close}
        ></FilePreviewImg>
      );
    case fileType.isPdf:
      return (
        <FilePreviewPdf
          file={file}
          close={close}
        ></FilePreviewPdf>
      );
    case fileType.isExcel:
      return (
        <FilePreviewExcel
          file={file}
          close={close}
        ></FilePreviewExcel>
      );
  }

  return null;
};

export const showPreviewFileDialog = (file: File): AppThunk => (dispatch) => {
  const close = () => { dispatch(removeDialog()); };
  const component = getComponent(file, close);

  if (!component) { return; }
  dispatch(addDialog({
    component,
    closeUI: true,
    closeByClick: true,
    defaultSize: false,
    blockStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
  }));
};
