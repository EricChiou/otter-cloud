import React, { FunctionComponent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectFileList, setFile } from 'src/store/system.slice';
import { FileService } from 'src/service';
import { ViewType } from '..';
import { BaseButton, BaseInput } from 'src/components/common';
import { Check, List, Photo, Seacrh } from 'src/components/icons';

import table from '../table.module.scss';

interface Props {
  viewType: ViewType;
  keyword: string;
  changeViewType: () => void;
  setKeyword: (value: string) => void;
}

const FileListToolBar: FunctionComponent<Props> = ({
  viewType,
  keyword,
  changeViewType,
  setKeyword,
}) => {
  const dispatch = useDispatch();
  const fileList = useSelector(selectFileList);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!fileList.find((file) => FileService.isFile(file))) { return; }

    if (fileList.find((file) => (FileService.isFile(file) && !file.selected))) {
      if (selectAll) { setSelectAll(false); }

    } else {
      if (!selectAll) { setSelectAll(true); }
    }
  }, [fileList, selectAll]);

  const selectAllOnClick = () => {
    if (!fileList.find((file) => FileService.isFile(file))) { return; }

    for (let i = 0; i < fileList.length; i++) {
      if (FileService.isFile(fileList[i])) {
        const file = Object.assign({}, fileList[i]);
        file.selected = !selectAll;
        dispatch(setFile(file, i));
      }
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className={table.toolBar}>
      <div className={table.viewType}>
        <BaseButton
          style={{ display: 'block', padding: '0' }}
          onClick={changeViewType}
        >
          {viewType === ViewType.list ? <List></List> : null}
          {viewType === ViewType.icon ? <Photo></Photo> : null}
        </BaseButton>
      </div>
      <div className={table.selectAll}>
        <div
          className={`${table.selectAllBtn}${selectAll ? ` ${table.active}` : ''}`}
          onClick={selectAllOnClick}
        >
          <Check></Check>
        </div>
      </div>
      <div className={table.search}>
        <BaseInput
          style={{ width: '180px', height: '22px', borderColor: keyword ? '#30a9de' : undefined }}
          onChange={(e, value) => { setKeyword(e ? e.target.value : value); }}
        ></BaseInput>
        <div className={table.searchIcon}>
          <Seacrh></Seacrh>
        </div>
      </div>
    </div>
  );
};

export default FileListToolBar;
