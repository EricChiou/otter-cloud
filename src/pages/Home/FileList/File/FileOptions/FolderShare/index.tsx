import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ShareFolder } from 'src/components/icons';
import { File } from 'src/interface/common';
import { FileService } from 'src/service';
import ShareFolderDialog from 'src/components/ShareFolderDialog';
import { addDialog, removeDialog } from 'src/components/common';
import { selectPrefix } from 'src/store/system.slice';

interface Props {
  file: File;
  onClick: () => void;
}

const FolderShare: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);

  const shareFolder = () => {
    console.log('Share Folder:', file);

    dispatch(addDialog({
      component: (
        <ShareFolderDialog
          folder={{
            name: file.name.slice(0, -1),
            data: {
              prefix: prefix.path + file.name,
            },
          }}
          close={() => { dispatch(removeDialog()); }}
        ></ShareFolderDialog>
      ),
      closeUI: true,
      closeByClick: true,
    }));

    onClick();
  };

  return <>{FileService.isFile(file) ? null : <ShareFolder onClick={shareFolder}></ShareFolder>}</>;
};

export default FolderShare;
