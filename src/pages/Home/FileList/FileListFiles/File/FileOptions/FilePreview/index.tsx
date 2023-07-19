import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { File } from 'src/interface/common';
import { Preview } from 'src/components/icons';
import { FileService } from 'src/service';
import { showPreviewFileDialog } from 'src/components/PreviewFileDialog';

interface Props {
  file: File;
  onClick: () => void;
}

const FilePreview: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();

  const previewFile = () => {
    dispatch(showPreviewFileDialog(file));

    if (onClick) { onClick(); }
  };

  const renderPreviewOption = () => {
    const fileType = FileService.getFileType(file.contentType, file.size);
    if (!fileType.isFile) {
      return null;

    } else {
      switch (true) {
        case fileType.isText:
        case fileType.isImage:
        case fileType.isPdf:
        case fileType.isWord:
        case fileType.isExcel:
        case fileType.isPpt:
        case fileType.isVideo:
          return <Preview onClick={previewFile}></Preview>;
      }
    }

    return null;
  };

  return <>{renderPreviewOption()}</>;
};

export default FilePreview;
