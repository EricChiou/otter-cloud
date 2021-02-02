import React, { FunctionComponent } from 'react';

import { ViewType } from '..';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseButton } from 'src/components/common';
import { List, Photo } from 'src/components/icons';

import table from '../table.module.scss';

interface Props {
  viewType: string;
  changeViewType: () => void;
}

const Header: FunctionComponent<Props> = ({ viewType, changeViewType }) => {
  return (
    <>
      {viewType === ViewType.list ?
        <div className={table.header}>
          <div className={table.nameCol}>
            <div className={table.viewType}>
              <BaseButton
                style={{ padding: '0' }}
                onClick={changeViewType}
              >
                <List></List>
              </BaseButton>
            </div>
            <span className={table.text}>{intl(keys.fileName, IntlType.firstUpper)}</span>
          </div>
          <div className={table.sizeCol}>
            <span className={table.text}>{intl(keys.fileSize, IntlType.firstUpper)}</span>
          </div>
          <div className={table.modifyCol}>
            <span className={table.text}>{intl(keys.lastModified, IntlType.firstUpper)}</span>
          </div>
          <div className={table.optionCol}></div>
        </div>
        : null
      }
      {viewType === ViewType.icon ?
        <div className={table.header}>
          <div className={table.nameCol}>
            <div className={table.viewType}>
              <BaseButton
                style={{ padding: '0' }}
                onClick={changeViewType}
              >
                <Photo></Photo>
              </BaseButton>
            </div>
            <span className={table.text}>{intl(keys.fileList, IntlType.firstUpper)}</span>
          </div>
        </div>
        : null
      }
    </>
  );
};

export default Header;
