import React, { FunctionComponent } from 'react';

import { ContentType } from 'src/constants';
import { BaseTooltip } from 'src/components/common';
import { CheckBox } from 'src/components/icons';
import { File } from 'src/vo/common';
import { ViewType } from '../../';
import FileIcon from '../FileIcon';
import FileNamePreviewImg from './FileNamePreviewImg';

import styles from './style.module.scss';
import table from '../../table.module.scss';

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
}) => {
  const renderTooltipContent = () => {
    if (file.contentType.indexOf(ContentType.image) > -1) {
      return <FileNamePreviewImg file={file}></FileNamePreviewImg>;
    }

    return <div style={{ whiteSpace: 'nowrap' }}>{file.name}</div>;
  }

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
            {file.name}
            <div className={styles.subLine}>
              {convertFileSize()}{file.contentType ? ', ' : null}
              {convertFileLastModified()}
            </div>
          </span>
        </BaseTooltip> : null
      }
      {viewType === ViewType.icon ?
        <BaseTooltip
          content={<div style={{ whiteSpace: 'nowrap' }}>{file.name}</div>}
          style={{
            display: 'inline-block',
            width: 'calc(100% - 52px)',
            height: '30px',
          }}
        >
          <div className={styles.iconFileName}>
            {file.name}
          </div>
        </BaseTooltip> : null
      }
    </>
  );
};

export default FileName;
