import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Share } from 'src/components/icons';
import { File } from 'src/vo/common';
import { showShareLinkDialog } from 'src/components/ShareLink';

interface Props {
  file: File;
  onClick: () => void;
}

const FileShare: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();

  const shareFile = () => {
    console.log('Share File:', file);
    dispatch(showShareLinkDialog(file));

    if (onClick) { onClick(); }
  }

  return <>{(file.contentType && file.size) ? <Share onClick={shareFile}></Share> : null}</>;
}

export default FileShare;
