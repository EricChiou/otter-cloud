import React, { FunctionComponent, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ContentType } from 'src/constants/file';
import { BaseTooltip } from 'src/components/common';
import {
  File as FileIcon, FileText, FileImage, FileAudio, FileVideo,
  FileArchive, FilePdf, FileWord, FileExcel, FilePPT, FileFolder,
  CheckBox,
} from 'src/components/icons';
import { File } from '../';
import { getPreviewUrl } from 'src/api/file';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';

import styles from './style.module.scss';
import table from '../../table.module.scss';

interface Props {
  file: File;
  convertFileSize: () => string;
  convertFileLastModified: () => string;
}

const FileName: FunctionComponent<Props> = ({ file, convertFileSize, convertFileLastModified }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const [url, setUrl] = useState('');
  const [countDown, setCountDown] = useState<number>(0);

  const renderIcon = () => {
    let Icon = FileIcon;
    if (file.contentType === '') {
      Icon = FileFolder;
    } else if (file.contentType.indexOf(ContentType.text) > -1) {
      Icon = FileText;
    } else if (file.contentType.indexOf(ContentType.image) > -1) {
      Icon = FileImage;
    } else if (file.contentType.indexOf(ContentType.audio) > -1) {
      Icon = FileAudio;
    } else if (file.contentType.indexOf(ContentType.video) > -1) {
      Icon = FileVideo;
    } else if (file.contentType.indexOf(ContentType.zip) > -1) {
      Icon = FileArchive;
    } else if (file.contentType.indexOf(ContentType.pdf) > -1) {
      Icon = FilePdf;
    } else if (file.contentType.indexOf(ContentType.word) > -1) {
      Icon = FileWord;
    } else if (file.contentType.indexOf(ContentType.excel) > -1) {
      Icon = FileExcel;
    } else if (file.contentType.indexOf(ContentType.ppt) > -1) {
      Icon = FilePPT;
    }

    return <Icon></Icon>;
  };

  const renderTooltipContent = () => {
    if (file.contentType.indexOf(ContentType.image) > -1) {
      const PreviewImage: FunctionComponent<{}> = () => {
        const getPreview = () => {
          getPreviewUrl(prefix, file.name, userProfile.token).then((resp) => {
            setUrl(resp.data.url);
            if (countDown) { window.clearTimeout(countDown); }
            setCountDown(window.setTimeout(() => {
              setUrl('');
            }, 10000));
          });
        };

        const onError = () => {
          if (url) { getPreview(); }
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
    <BaseTooltip content={renderTooltipContent()}>
      {file.selected ?
        <span className={styles.active}><CheckBox></CheckBox></span> :
        <span>{renderIcon()}</span>
      }
      <span className={`${table.text} ${styles.text} ${styles.iconText}`}>
        {file.name}
        <div className={styles.subLine}>
          {convertFileSize()}{file.contentType ? ', ' : null}
          {convertFileLastModified()}
        </div>
      </span>
    </BaseTooltip>
  );
};

export default FileName;
