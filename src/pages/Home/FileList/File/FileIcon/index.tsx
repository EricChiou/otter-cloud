import React, { FunctionComponent } from 'react';
import { ViewType } from '../../';
import {
  File as FileSvg, FileText, FileImage, FileAudio, FileVideo,
  FileArchive, FilePdf, FileWord, FileExcel, FilePPT, FileFolder,
} from 'src/components/icons';
import { File } from 'src/vo/common';
import { ContentType } from 'src/constants';
import PreviewImg from './FileIconPreviewImg';
import { FileService } from 'src/service';

interface Props {
  file: File;
  viewType: ViewType;
}

const FileIcon: FunctionComponent<Props> = ({ file, viewType }) => {

  const renderIcon = () => {
    let icon = <FileSvg></FileSvg>;
    if (!FileService.isFile(file)) {
      icon = <FileFolder></FileFolder>;

    } else if (file.contentType.indexOf(ContentType.text) > -1) {
      icon = <FileText></FileText>;

    } else if (file.contentType.indexOf(ContentType.image) > -1) {
      switch (viewType) {
        case ViewType.list:
          icon = <FileImage></FileImage>;
          break;

        case ViewType.icon:
          icon = <PreviewImg file={file}></PreviewImg>;
          break;
      }

    } else if (file.contentType.indexOf(ContentType.audio) > -1) {
      icon = <FileAudio></FileAudio>;

    } else if (file.contentType.indexOf(ContentType.video) > -1) {
      icon = <FileVideo></FileVideo>;

    } else if (file.contentType.indexOf(ContentType.zip) > -1) {
      icon = <FileArchive></FileArchive>;

    } else if (file.contentType.indexOf(ContentType.pdf) > -1) {
      icon = <FilePdf></FilePdf>;

    } else if (file.contentType.indexOf(ContentType.word) > -1) {
      icon = <FileWord></FileWord>;

    } else if (file.contentType.indexOf(ContentType.excel) > -1) {
      icon = <FileExcel></FileExcel>;

    } else if (file.contentType.indexOf(ContentType.ppt) > -1) {
      icon = <FilePPT></FilePPT>;
    }

    return icon;
  };

  return (
    <>
      {viewType === ViewType.list ?
        renderIcon() : null
      }
      {viewType === ViewType.icon ?
        renderIcon() : null
      }
    </>
  );
};

export default FileIcon;
