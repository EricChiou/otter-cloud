import React, { FunctionComponent, WheelEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectPrefix, setPrefix } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
import CreateFolder from './PathCreateFolder';

import styles from './style.module.scss';

const Path: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);

  const pathOnClick = (newPrefix: string) => {
    if (prefix !== newPrefix) {
      dispatch(setPrefix(newPrefix));
    }
  };

  const onWheel = (e: WheelEvent) => {
    if (e.currentTarget.scrollWidth <= e.currentTarget.clientWidth) { return; }
    e.currentTarget.scrollLeft += e.deltaY;
  };

  const renderPrefix = () => {
    let preMergePrefix = '';

    return prefix.split('/').map((path, i) => {
      if (path) {
        const mergePrefix = `${preMergePrefix}${path}/`;
        preMergePrefix += `${path}/`;
        return (
          <span key={'path_' + i} className={styles.folder}>
            <span className={styles.prefix} onClick={() => { pathOnClick(mergePrefix); }}>{path}</span>
            <span className={styles.backslash}>/</span>
          </span>
        );
      }
      return null;
    });
  }

  return (
    <div id={styles.path} onWheel={onWheel}>
      <span className={styles.folder}>
        <span className={styles.prefix} onClick={() => { pathOnClick(''); }}>{intl(keys.myCloudStorge, IntlType.perUpper)}</span>
        <span className={styles.backslash}>/</span>
      </span>
      {renderPrefix()}
      <CreateFolder></CreateFolder>
    </div>
  );
}

export default Path;