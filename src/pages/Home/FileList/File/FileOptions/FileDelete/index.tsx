import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { File } from 'src/pages/Home/FileList/File';
import { Delete, Warning } from 'src/components/icons';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { intl, keys } from 'src/i18n';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';

import styles from './style.module.scss';

interface Props {
  file: File;
}

const FileDelete: FunctionComponent<Props> = ({ file }) => {
  const dispatch = useDispatch();

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
        <BaseButton type={ButtonType.danger} style={buttonStyle} onClick={deleteFile}>Delete</BaseButton>
        &nbsp;&nbsp;
        <BaseButton onClick={() => { dispatch(removeDialog()); }} style={buttonStyle}>Cancel</BaseButton>
      </div>
    );
    dispatch(addDialog({ component }));
  };

  const deleteFile = () => {
    console.log('Delete File', file);
    dispatch(removeDialog());
  };

  return <Delete onClick={showDeleteWarning}></Delete>
}

export default FileDelete;
