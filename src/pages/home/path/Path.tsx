import React, { FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectPrefix, setPrefix } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';

import styles from './Path.module.scss';

const Path: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);

  const pathOnClick = (newPrefix: string) => {
    if (prefix !== newPrefix) {
      dispatch(setPrefix(newPrefix));
    }
  };

  const renderPrefix = () => {
    let mergePrefix = '';

    return prefix.split('/').map((path, i) => {
      if (path) {
        mergePrefix += `${path}/`
        return (
          <span key={'path_' + i}>
            <span className={styles.prefix} onClick={() => { pathOnClick(mergePrefix); }}>{path}</span>
            <span className={styles.backslash}>/</span>
          </span>
        );
      }
      return false;
    });
  }

  return (
    <div id={styles.path}>
      <span>
        <span className={styles.prefix} onClick={() => { pathOnClick(''); }}>{intl(keys.myCloudStorge, IntlType.perUpper)}</span>
        <span className={styles.backslash}>/</span>
      </span>
      {renderPrefix()}
      <div className={styles.bottomLine}></div>
    </div>
  );
}

export default Path;