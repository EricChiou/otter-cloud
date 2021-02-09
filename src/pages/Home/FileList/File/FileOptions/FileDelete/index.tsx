import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { File } from 'src/vo/common';
import { Delete } from 'src/components/icons';
import { addDialog, removeDialog } from 'src/components/common';
import { removeFile, removeFolder } from 'src/api/file';
import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix } from 'src/store/system.slice';
import { removeFileNext } from 'src/shared/file-shared';
import DeleteFileDialog from 'src/components/DeleteFileDialog';

// import styles from './style.module.scss';

interface Props {
  file: File;
  onClick: () => void;
}

const FileDelete: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);

  const showDeleteWarning = () => {
    const confirm = deleteFile;
    const cancel = () => { dispatch(removeDialog()); };
    const component = <DeleteFileDialog confirm={confirm} cancel={cancel}></DeleteFileDialog>;

    dispatch(addDialog({ component }));

    if (onClick) { onClick(); }
  };

  const deleteFile = () => {
    // console.log('Delete File', file);
    if (file.size && file.contentType) {
      dispatch(removeDialog());
      removeFile(prefix, file.name, userProfile.token).then(() => { removeFileNext(); });

    } else {
      deleteFolder();
    }
  };

  const deleteFolder = () => {
    // console.log('deleteFolder', file);
    dispatch(removeDialog());
    removeFolder(prefix + file.name, userProfile.token).then(() => { removeFileNext(); });
  }

  return <Delete onClick={showDeleteWarning}></Delete>;
}

export default FileDelete;
