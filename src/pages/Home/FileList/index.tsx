import React, { FunctionComponent, useEffect, DragEvent, RefObject, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectPrefix, setPrefix } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
import FileComponent, { File } from './File';
import FileMenu from './FileMenu';
import { Upload, Warning } from 'src/components/icons';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';
import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';

import styles from './style.module.scss';
import table from './table.module.scss';

const FikeList: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const fileListRef: RefObject<HTMLDivElement> = useRef(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [showDownload, setShowDownload] = useState<boolean>(false);

  useEffect(() => {
    console.log('get file list:', prefix);
    // get file list
    setFileList(fakeFileList);
  }, [prefix]);

  useEffect(() => {
    const result = fileList.find((file) => file.selected);
    if (result && !showDownload) {
      setShowDownload(true);
    } else if (!result && showDownload) {
      setShowDownload(false);
    }
  }, [fileList, showDownload]);

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
      <FileMenu showDownload={showDownload} download={downloadFiles} del={showDeleteWarning}></FileMenu>
      <div className={styles.mask} onDrop={drop} onDragLeave={dragLeave}>
        <div className={styles.icon}>
          <Upload></Upload>
        </div>
      </div>
    </div>
  );
}

export default FikeList;

const fakeFileList: File[] = [
  {
    contentType: 'application/octet-stream',
    name: 'cat',
    size: 5964,
    lastModified: '2020-11-06T14:40:02.1738874+08:00',
    selected: false,
  },
  {
    contentType: 'audio/mpeg',
    name: 'Baby Cats.mp3',
    size: 5729325,
    lastModified: '2020-11-11T12:15:57.7300048+08:00',
    selected: false,
  },
  {
    contentType: 'image/jpeg',
    name: 'cat.jpg',
    size: 5964,
    lastModified: '2020-11-06T10:39:52.4392648+08:00',
    selected: false,
  },
  {
    contentType: 'image/png',
    name: 'cat.png',
    size: 4537,
    lastModified: '2020-11-06T10:39:52.4412612+08:00',
    selected: false,
  },
  {
    contentType: 'image/jpeg',
    name: 'cat2.jpg',
    size: 7676,
    lastModified: '2020-11-06T10:39:52.4422566+08:00',
    selected: false,
  },
  {
    contentType: 'image/jpeg',
    name: 'cat3.jpg',
    size: 4023,
    lastModified: '2020-11-06T10:39:52.4412612+08:00',
    selected: false,
  },
  {
    contentType: 'application/octet-stream',
    name: 'file.7z',
    size: 90,
    lastModified: '2020-11-11T09:28:30.0011283+08:00',
    selected: false,
  },
  {
    contentType: 'text/plain',
    name: 'file.txt',
    size: 1,
    lastModified: '2020-11-11T09:26:26.0100965+08:00',
    selected: false,
  },
  {
    contentType: 'application/x-zip-compressed',
    name: 'file.zip',
    size: 150,
    lastModified: '2020-11-11T09:28:00.9691468+08:00',
    selected: false,
  },
  {
    contentType: 'video/mp4',
    name: 'mov_bbb.mp4',
    size: 788493,
    lastModified: '2020-11-11T09:27:18.0411223+08:00',
    selected: false,
  },
  {
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    name: 'test.docx',
    size: 12049,
    lastModified: '2020-11-11T09:30:34.4375835+08:00',
    selected: false,
  },
  {
    contentType: 'application/pdf',
    name: 'test.pdf',
    size: 29749,
    lastModified: '2020-11-11T09:30:59.8154661+08:00',
    selected: false,
  },
  {
    contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    name: 'test.pptx',
    size: 33656,
    lastModified: '2020-11-11T09:30:34.4375835+08:00',
    selected: false,
  },
  {
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    name: 'test.xlsx',
    size: 10052,
    lastModified: '2020-11-11T09:30:34.4385814+08:00',
    selected: false,
  },
  {
    contentType: '',
    name: 'dir1/',
    size: 0,
    lastModified: '2020-11-11T09:30:34.4385814+08:00',
    selected: false,
  },
  {
    contentType: '',
    name: 'dir2/',
    size: 0,
    lastModified: '2020-11-11T09:30:34.4385814+08:00',
    selected: false,
  },
  {
    contentType: '',
    name: 'dir3/',
    size: 0,
    lastModified: '2020-11-11T09:30:34.4385814+08:00',
    selected: false,
  },
];
