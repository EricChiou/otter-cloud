import React, { FunctionComponent, useEffect, DragEvent, RefObject, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectPrefix, setPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { intl, keys, IntlType } from 'src/i18n';
import FileComponent, { File } from './File';
import FileListMenu from './FileListMenu';
import { Upload, Warning } from 'src/components/icons';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';
import { ApiResult } from 'src/constants';
import { getFileList } from 'src/api/file';

import styles from './style.module.scss';
import table from './table.module.scss';

const FikeList: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);
  const fileListRef: RefObject<HTMLDivElement> = useRef(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [showOtherOptions, setShowOtherOptions] = useState<boolean>(false);

  useEffect(() => {
    // console.log('get file list:', prefix);
    getFileList(prefix, userProfile.token).then((resp) => {
      if (resp.status === ApiResult.Success) {
        const fileList: File[] = resp.data.map((data) => {
          return {
            contentType: data.contentType,
            name: data.name,
            size: data.size,
            lastModified: data.lastModified,
            selected: false,
          };
        });
        setFileList(fileList);
      }

    }).catch((error) => { console.log(error); });

  }, [prefix, userProfile]);

  useEffect(() => {
    const result = fileList.find((file) => file.selected);
    if (result && !showOtherOptions) {
      setShowOtherOptions(true);
    } else if (!result && showOtherOptions) {
      setShowOtherOptions(false);
    }
  }, [fileList, showOtherOptions]);

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Upload Files', e.dataTransfer.files);
    fileListRef.current?.classList.remove(styles.dragOver);
  };

  const dragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add(styles.dragOver);
  };

  const dragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileListRef.current?.classList.remove(styles.dragOver);
  }

  const fileOnSelected = (file: File, index: number) => {
    if (!file.contentType && !file.size) {
      dispatch(setPrefix(prefix + file.name));
    } else {
      const newFileList = [...fileList];
      newFileList[index].selected = !newFileList[index].selected;
      setFileList(newFileList);
    }
  };

  const downloadFiles = () => {
    const files = fileList.filter((file) => file.selected);
    console.log('Download Files', files);
  }

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
        <BaseButton type={ButtonType.danger} style={buttonStyle} onClick={deleteFiles}>Delete</BaseButton>
        &nbsp;&nbsp;
        <BaseButton onClick={() => { dispatch(removeDialog()); }} style={buttonStyle}>Cancel</BaseButton>
      </div>
    );
    dispatch(addDialog({ component }));
  }

  const deleteFiles = () => {
    const files = fileList.filter((file) => file.selected);
    console.log('Delete Files', files);
    dispatch(removeDialog());
  };



  const renderFiles = () => {
    return fileList.map((file, index) => {
      return (
        <FileComponent
          key={file.name}
          file={file}
          index={index}
          onSelected={fileOnSelected}
        ></FileComponent>
      );
    });
  }

  return (
    <div ref={fileListRef} id={styles.fileList} onDragOver={dragOver}>
      <div className={table.header}>
        <div className={table.nameCol}>
          <span className={table.text}>{intl(keys.fileName, IntlType.firstUpper)}</span>
        </div>
        <div className={table.sizeCol}>
          <span className={table.text}>{intl(keys.fileSize, IntlType.firstUpper)}</span>
        </div>
        <div className={table.modifyCol}>
          <span className={table.text}>{intl(keys.lastModified, IntlType.firstUpper)}</span>
        </div>
        <div className={table.optionCol}></div>
      </div>
      <div className={table.list}>
        {renderFiles()}
      </div>
      <FileListMenu
        showOtherOptions={showOtherOptions}
        download={downloadFiles}
        del={showDeleteWarning}>
      </FileListMenu>
      <div className={styles.mask} onDrop={drop} onDragLeave={dragLeave}>
        <div className={styles.icon}>
          <Upload></Upload>
        </div>
      </div>
    </div>
  );
}

export default FikeList;
