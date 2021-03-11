import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { ViewType } from '../../..';
import {
  File as FileSvg, FileText, FileImage, FileAudio, FileVideo,
  FileArchive, FilePdf, FileWord, FileExcel, FilePPT, FileFolder,
  FolderShared,
} from 'src/components/icons';
import { File } from 'src/interface/common';
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
    const fileType = FileService.getFileType(file.contentType, file.size);
    let icon = <FileSvg></FileSvg>;
    if (!fileType.isFile) {
      const hasSharedFolder = sharedFolderList.find((sharedFolder) => (
        sharedFolder.ownerAcc === userProfile.acc &&
        sharedFolder.prefix === prefix.path + file.name
      ));

      icon = hasSharedFolder ? <FolderShared></FolderShared> : <FileFolder></FileFolder>;

    } else if (fileType.isText) {
      icon = <FileText></FileText>;

    } else if (fileType.isImage) {
      switch (viewType) {
        case ViewType.list:
          icon = <FileImage></FileImage>;
          break;

        case ViewType.icon:
          icon = <PreviewImg file={file}></PreviewImg>;
          break;
      }

    } else if (fileType.isAudio) {
      icon = <FileAudio></FileAudio>;

    } else if (fileType.isVideo) {
      icon = <FileVideo></FileVideo>;

    } else if (fileType.isZip) {
      icon = <FileArchive></FileArchive>;

    } else if (fileType.isPdf) {
      icon = <FilePdf></FilePdf>;

    } else if (fileType.isWord) {
      icon = <FileWord></FileWord>;

    } else if (fileType.isExcel) {
      icon = <FileExcel></FileExcel>;

    } else if (fileType.isPpt) {
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
