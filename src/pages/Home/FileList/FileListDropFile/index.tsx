/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FunctionComponent,
  DragEvent,
  RefObject,
  useEffect,
} from 'react';
import { useSelector } from 'react-redux';

import { selectPrefix } from 'src/store/system.slice';
import { Upload } from 'src/components/icons';
import { FileService, UploadFile } from 'src/service';

import styles from '../style.module.scss';

interface Props {
  fileListRef: RefObject<HTMLDivElement>;
}

const FileListDropFile: FunctionComponent<Props> = ({ fileListRef }) => {
  const prefix = useSelector(selectPrefix);

  useEffect(() => {
    const dragOver = (event: unknown) => {
      const e = event as DragEvent;
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer && e.dataTransfer.types.find((type: string) => type === 'Files')) {
        if (e.currentTarget) {
          e.currentTarget.classList.add(styles.dragOver);
        }
      }
    };

    const fileListEle = fileListRef.current;
    if (fileListEle) {
      fileListEle.addEventListener('dragover', dragOver);
    }

    return () => {
      fileListEle?.removeEventListener('dragover', dragOver);
    };
  }, [fileListRef]);

  const readAllEntries = (dirReader: any, entries: any[]): Promise<boolean> => {
    return new Promise((resolve) => {
      dirReader.readEntries((subEntries: any) => {
        if (!subEntries.length) {
          resolve(true);

        } else {
          subEntries.forEach((subEntry: any) => { entries.push(subEntry); });
          readAllEntries(dirReader, entries).then(() => {
            resolve(true);
          });
        }
      });
    });
  };

  const traverseFileTree = (entry: any, path: string, fileList: UploadFile[]): Promise<boolean> => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          fileList.push({ file, path });
          resolve(true);
        });

      } else if (entry.isDirectory) {
        const subEntries: any[] = [];
        const dirReader = entry.createReader();
        readAllEntries(dirReader, subEntries).then(() => {
          const promises: Promise<boolean>[] = [];
          for (const subEntry of subEntries) {
            promises.push(traverseFileTree(subEntry, path + entry.name + '/', fileList));
          }

          Promise.all(promises).then(() => { resolve(true); });
        });

      } else { resolve(true); }
    });
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    fileListRef.current?.classList.remove(styles.dragOver);
    if (e.dataTransfer.items && e.dataTransfer.items.length) {
      const fileList: UploadFile[] = [];
      const promises: Promise<boolean>[] = [];
      for (const item of Array.from(e.dataTransfer.items)) {
        const entry = item.webkitGetAsEntry();
        promises.push(traverseFileTree(entry, prefix.path, fileList));
      }

      Promise.all(promises).then(() => {
        FileService.uploadFiles(prefix, fileList);
      });
    }
  };

  const dragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileListRef.current?.classList.remove(styles.dragOver);
  };

  return (
    <div className={styles.mask} onDrop={drop} onDragLeave={dragLeave}>
      <div className={styles.icon}>
        <Upload></Upload>
      </div>
    </div>
  );
};

export default FileListDropFile;
