import React, { FunctionComponent, useEffect, DragEvent, RefObject, useRef } from 'react';
import { useSelector } from 'react-redux';

import FileTable, { File } from './FileTable';
import { selectPrefix } from 'src/store/system.slice';
import { Upload } from 'src/components/icons';

import styles from './style.module.scss';

const FikeList: FunctionComponent<{}> = () => {
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
      size: 0,
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

  const prefix = useSelector(selectPrefix);
  const fileListRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    console.log('get file list:', prefix);
    // get file list
  }, [prefix]);

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log(e.dataTransfer.files);
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

  return (
    <div ref={fileListRef} id={styles.fileList} onDragOver={dragOver} >
      <FileTable fileList={fakeFileList}></FileTable>
      <div className={styles.mask} onDrop={drop} onDragLeave={dragLeave}>
        <div className={styles.icon}>
          <Upload></Upload>
        </div>
      </div>
    </div>
  );
}

export default FikeList;
