import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { File } from 'src/vo/common';
import { Delete, Warning } from 'src/components/icons';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { intl, keys, IntlType } from 'src/i18n';
import { addDialog, removeDialog } from 'src/components/common';
import { removeFile, removeFolder } from 'src/api/file';
import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix } from 'src/store/system.slice';
import { removeFileNext } from 'src/shared/file-shared';

import styles from './style.module.scss';

interface Props {
  file: File;
  onClick: () => void;
}

const FileDelete: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);

  const showDeleteWarning = () => {
    const buttonStyle = {
      width: '80px',
      textAlign: 'center',
    };

    const component = (
      <div className={styles.delete}>
        <div className={styles.icon}>
          <Warning></Warning>
        </div>
        <div className={styles.text}>
          {intl(keys.checkToDelete)}
          <br></br>
          {intl(keys.cannotUndone)}
        </div>
        <BaseButton type={ButtonType.danger} style={buttonStyle} onClick={deleteFile}>
          {intl(keys.delete, IntlType.perUpper)}
        </BaseButton>
        &nbsp;&nbsp;
        <BaseButton
          type={ButtonType.normal}
          style={buttonStyle}
          onClick={() => { dispatch(removeDialog()); }}
        >
          {intl(keys.cancel, IntlType.perUpper)}
        </BaseButton>
      </div>
    );
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

  return <Delete onClick={showDeleteWarning}></Delete>
}

export default FileDelete;
