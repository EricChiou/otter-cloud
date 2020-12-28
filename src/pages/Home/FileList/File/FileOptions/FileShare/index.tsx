import React, { FunctionComponent } from 'react';

import { Share } from 'src/components/icons';
import { File } from 'src/pages/Home/FileList/File';

interface Props {
  file: File;
  onClick: () => void;
}

const FileShare: FunctionComponent<Props> = ({ file, onClick }) => {

  const shareFile = () => {
    console.log('Share File:', file);

    if (onClick) { onClick(); }
  }

  return <>{(file.contentType && file.size) ? <Share onClick={shareFile}></Share> : null}</>;
}

export default FileShare;
