import React, { FunctionComponent, useState, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { selectPrefix, selectFileList, setFile } from 'src/store/system.slice';
import { FileService } from 'src/service';
import { ViewType } from '..';
import { File } from 'src/interface/common';
import FileComponent from './File';
import { fileListOnScroll } from 'src/shared/file-shared';

import table from '../table.module.scss';

interface Props {
  viewType: ViewType;
  keyword: string;
}

const FileListFiles: FunctionComponent<Props> = ({ viewType, keyword }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const fileList = useSelector(selectFileList);
  const [anchorPoint, setAnchorPoint] = useState<number | null>(null);

  const rangeSelection = (e: MouseEvent, file: File, index: number) => {
    if (file.selected && !e.shiftKey) {
      setAnchorPoint(index);
    }

    if (!file.selected && !e.shiftKey) {
      setAnchorPoint(null);
    }

    if (e.shiftKey && anchorPoint !== null) {
      for (let i = 0; i < fileList.length; i++) {
        const targetFile: File = { ...fileList[i] };

        if (i < anchorPoint && i < index) {
          targetFile.selected = false;

        } else if (i > anchorPoint && i > index) {
          targetFile.selected = false;

        } else if (i === anchorPoint) {
          targetFile.selected = true;

        } else {
          targetFile.selected = !targetFile.selected;
        }
        dispatch(setFile(targetFile, i));
      }
    }
  };

  const fileOnSelected = (e: MouseEvent, file: File, index: number) => {
    let search = (prefix.path + file.name) ?
      `?prefix=${encodeURIComponent(prefix.path + file.name)}` : '';
    search += prefix.sharedId ? `&sharedId=${prefix.sharedId}` : '';


    if (!FileService.isFile(file)) {
      history.push({
        pathname: history.location.pathname,
        search: search,
      });

    } else {
      const file = Object.assign({}, fileList[index]);
      file.selected = !file.selected;
      dispatch(setFile(file, index));

      rangeSelection(e, file, index);
    }
  };

  return (
    <div
      className={
        viewType === ViewType.list ? table.list :
          viewType === ViewType.icon ? table.icon :
            table.list
      }
      onScroll={() => { fileListOnScroll(); }}
    >
      {fileList
        .filter((file) => (!keyword || file.name.indexOf(keyword) > -1))
        .map((file, index) => {
          return (
            <FileComponent
              key={file.name}
              file={file}
              index={index}
              onSelected={fileOnSelected}
              viewType={viewType}
            ></FileComponent>
          );
        })
      }
    </div>
  );
};

export default FileListFiles;