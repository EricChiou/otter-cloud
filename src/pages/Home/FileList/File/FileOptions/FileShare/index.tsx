import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Share } from 'src/components/icons';
import { File } from 'src/vo/common';
import { showShareLinkDialog } from 'src/components/ShareLink';
import { FileService } from 'src/service';

interface Props {
  file: File;
  onClick: () => void;
}

const FileShare: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();

  const shareFile = () => {
    // console.log('Share File:', file);
    dispatch(showShareLinkDialog(file));

    if (onClick) { onClick(); }
  }

  return <>{FileService.isFile(file) ? <Share onClick={shareFile}></Share> : null}</>;
}

export default FileShare;
