import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { ViewType } from '../../..';
import {
  File as FileSvg, FileText, FileImage, FileAudio, FileVideo,
  FileArchive, FilePdf, FileWord, FileExcel, FilePPT, FileFolder,
  FolderShared,
} from 'src/components/icons';
import { File } from 'src/interface/common';
import { ContentType } from 'src/constants';
import PreviewImg from './FileIconPreviewImg';
import { FileService } from 'src/service';
import { selectPrefix, selectSharedFolderList } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';

interface Props {
  file: File;
  viewType: ViewType;
}

const FileIcon: FunctionComponent<Props> = ({ file, viewType }) => {
  const userProfile = useSelector(selectUserProfile);
  const prefix = useSelector(selectPrefix);
  const sharedFolderList = useSelector(selectSharedFolderList);

  const renderIcon = () => {
    let icon = <FileSvg></FileSvg>;
    if (!FileService.isFile(file)) {
      const hasSharedFolder = sharedFolderList.find((sharedFolder) => (
        sharedFolder.ownerAcc === userProfile.acc &&
        sharedFolder.prefix === prefix.path + file.name
      ));

      icon = hasSharedFolder ? <FolderShared></FolderShared> : <FileFolder></FileFolder>;

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
