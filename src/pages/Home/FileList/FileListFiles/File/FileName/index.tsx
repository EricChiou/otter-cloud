import React, { FunctionComponent } from 'react';

import { BaseTooltip } from 'src/components/common';
import { CheckBox } from 'src/components/icons';
import { File } from 'src/interface/common';
import { ViewType } from '../../..';
import FileIcon from '../FileIcon';
import FileNamePreviewImg from './FileNamePreviewImg';
import { FileService } from 'src/service/file.service';

import styles from './style.module.scss';
import table from '../../../table.module.scss';

interface Props {
  file: File;
  convertFileSize: () => string;
  convertFileLastModified: () => string;
  viewType: ViewType;
}

const FileName: FunctionComponent<Props> = ({
  file,
  convertFileSize,
  convertFileLastModified,
  viewType,
}: Props) => {
  const getFileName = (): string => {
    return FileService.isFile(file) ? file.name : file.name.slice(0, -1);
  };

  const renderTooltipContent = () => {
    const fileType = FileService.getFileType(file.contentType, file.size);
    if (fileType.isImage) {
      return <FileNamePreviewImg file={file}></FileNamePreviewImg>;
    }

    return <div style={{ whiteSpace: 'nowrap' }}>{getFileName()}</div>;
  };

  return (
    <>
      {viewType === ViewType.list ?
        <BaseTooltip content={renderTooltipContent()}>
          {file.selected ?
            <span className={styles.active}><CheckBox></CheckBox></span> :
            <span>
              <FileIcon file={file} viewType={viewType}></FileIcon>
            </span>
          }
          <span className={`${table.text} ${styles.text} ${styles.iconText}`}>
            {getFileName()}
            <div className={styles.subLine}>
              {convertFileSize()}{file.contentType ? ', ' : null}
              {convertFileLastModified()}
            </div>
          </span>
        </BaseTooltip> : null
      }
      {viewType === ViewType.icon ?
        <BaseTooltip
          content={<div style={{ whiteSpace: 'nowrap' }}>{getFileName()}</div>}
          style={{
            display: 'inline-block',
            width: 'calc(100% - 52px)',
            height: '30px',
          }}
        >
          <div className={styles.iconFileName}>
            {getFileName()}
          </div>
        </BaseTooltip> : null
      }
    </>
  );
};

export default FileName;
