import React, { FunctionComponent, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUserProfile } from 'src/store/user.slice';
import { selectPrefix } from 'src/store/system.slice';
import { File } from 'src/interface/common';
import { Rename } from 'src/components/icons';
import {
  addDialog,
  removeDialog,
  BaseInput,
  BaseButton,
  ButtonType,
} from 'src/components/common';
import { addMessage, MessageType } from 'src/components/Message';
import { intl, keys, IntlType } from 'src/i18n';
import { renameFile } from 'src/api/file';
import { renameFileNext } from 'src/shared/file-shared';
import { ApiResult } from 'src/constants';
import { FileService } from 'src/service';

import styles from './style.module.scss';

interface Props {
  file: File;
  onClick: () => void;
}

const FileRename: FunctionComponent<Props> = ({ file, onClick }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  let newFilename = '';

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    newFilename = e.target.value;
  };

  const close = () => {
    dispatch(removeDialog());
  };

  const doRenameFailed = (errorMsg?: string) => {
    const msg = errorMsg ? errorMsg : intl(keys.renameFailed);
    dispatch(addMessage(msg, MessageType.warning));
  };

  const doRename = () => {
    // console.log(newFilename);
    if (!newFilename) { return; }

    renameFile(prefix.path, file.name, newFilename, userProfile.token).then(() => {
      renameFileNext();
      close();

    }).catch((error) => {
      if (error.status === ApiResult.Duplicate) {
        doRenameFailed(intl(keys.renameDuplicate));
      }
    });
  };

  const rename = () => {
    const component = (
      <div className={styles.renameDialog}>
        <div className={styles.header}>{intl(keys.rename, IntlType.firstUpper)}：{file.name}</div>
        <div className={styles.newFilename}>
          {intl(keys.newFilename, IntlType.firstUpper)}：<br />
          <BaseInput style={{ width: 'calc(100% - 12px)' }} onChange={onChange}></BaseInput>
        </div>
        <div className={styles.footer}>
          <BaseButton onClick={doRename}>
            {intl(keys.confirm, IntlType.firstUpper)}
          </BaseButton>
          &nbsp;
          <BaseButton type={ButtonType.normal} onClick={close}>
            {intl(keys.cancel, IntlType.firstUpper)}
          </BaseButton>
        </div>
      </div>
    );

    dispatch(addDialog({
      component: component,
      closeUI: true,
      closeByClick: true,
    }));

    onClick();
  };

  return (
    <>
      {FileService.isFile(file) ?
        <Rename
          onClick={rename}
        ></Rename> : null
      }
    </>
  );
};

export default FileRename;