import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { File } from 'src/interface/common';
import { Delete } from 'src/components/icons';
import { addDialog, removeDialog } from 'src/components/common';
import { removeFile, removeFolder } from 'src/api/file';
import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix } from 'src/store/system.slice';
import { removeFileNext } from 'src/shared/file-shared';
import DeleteFileDialog from 'src/components/DeleteFileDialog';
import { FileService } from 'src/service';
import { ApiResult } from 'src/constants';
import { addMessage, MessageType } from 'src/components/Message';
import { intl, keys, IntlType } from 'src/i18n';

// import styles from './style.module.scss';

interface Props {
  file: File;
  onClick: () => void;
}

const FileDelete: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);

  const deleteFolder = () => {
    // console.log('deleteFolder', file);
    dispatch(removeDialog());
    removeFolder(
      prefix.sharedId,
      prefix.path + file.name,
      userProfile.token,
    ).then(() => { removeFileNext(); });
  };

  const deleteFile = () => {
    // console.log('Delete File', file);
    if (FileService.isFile(file)) {
      dispatch(removeDialog());
      removeFile(prefix, file.name, userProfile.token)
        .then(() => { removeFileNext(); })
        .catch((error) => {
          if (error.status && error.status === ApiResult.PermissionDenied) {
            dispatch(addMessage(
              intl(keys.permissionDenied, IntlType.perUpper),
              MessageType.warning,
            ));
          }
        });

    } else {
      deleteFolder();
    }
  };

  const showDeleteWarning = () => {
    const component = (
      <DeleteFileDialog
        fileName={file.name}
        confirm={deleteFile}
        cancel={() => { dispatch(removeDialog()); }}
      ></DeleteFileDialog>
    );

    dispatch(addDialog({ component }));

    if (onClick) { onClick(); }
  };

  return <Delete onClick={showDeleteWarning}></Delete>;
};

export default FileDelete;
