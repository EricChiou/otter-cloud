import React, {
  FunctionComponent,
  DragEvent,
  RefObject,
  useEffect,
} from 'react';
import { useSelector } from 'react-redux';

import { selectPrefix } from 'src/store/system.slice';
import { Upload } from 'src/components/icons';
import { FileService } from 'src/service';

import styles from '../style.module.scss';

interface Props {
  fileListRef: RefObject<HTMLDivElement>;
}

const FileListDropFile: FunctionComponent<Props> = ({ fileListRef }) => {
  const prefix = useSelector(selectPrefix);

  useEffect(() => {
    const dragOver = (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer && e.dataTransfer.types.find((type: string) => type === 'Files')) {
        if (e.currentTarget && e.currentTarget) {
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

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    FileService.uploadFiles(prefix, e.dataTransfer.files);
    fileListRef.current?.classList.remove(styles.dragOver);
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
}

export default FileListDropFile;
