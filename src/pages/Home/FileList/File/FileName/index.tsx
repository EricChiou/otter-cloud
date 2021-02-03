import React, { FunctionComponent, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ContentType } from 'src/constants';
import { BaseTooltip } from 'src/components/common';
import { CheckBox } from 'src/components/icons';
import { File } from 'src/vo/common';
import { getPreviewUrl } from 'src/api/file';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';
import { ViewType } from '../../';
import FileIcon from '../FileIcon';

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
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [url, setUrl] = useState('');

  const renderTooltipContent = () => {
    if (file.contentType.indexOf(ContentType.image) > -1) {
      const PreviewImage: FunctionComponent<{}> = () => {
        const getPreview = () => {
          getPreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
            setUrl(resp.data.url);
          });
        };

        const onError = () => {
          if (url) {
            setTimeout(() => {
              getPreview();
            }, 3000);
          }
        };

        useEffect(() => {
          if (!url) {
            getPreview();
          }

        }, []);

        return <img
          className={styles.previewImage}
          src={url}
          alt="preview"
          onError={onError}
        ></img>;
      };

      return <PreviewImage></PreviewImage>;
    }

    return file.name;
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
        <BaseTooltip content={file.name} style={{
          display: 'inline-block',
          width: 'calc(100% - 52px)',
          height: '30px',
        }}>
          <div className={styles.iconFileName}>
            {file.name}
          </div>
        </BaseTooltip> : null
      }
    </>
  );
};

export default FileName;
