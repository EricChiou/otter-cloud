import React, { FunctionComponent, useState } from 'react';

import { Language } from '../../../components/icon';
import { intl, keys, IntlType } from '../../../i18n';
import LangList from '../../../components/lang-list/LangList';

import styles from './Lang.module.scss';

const Lang: FunctionComponent<{}> = () => {
  const [showLangList, setShowLangList] = useState(false);

  const onClick = () => {
    setShowLangList(!showLangList);
  }

  const closeLangList = () => {
    setShowLangList(false);
  }

  return (
    <div className={styles.lang}>
      <div className={styles.btn} onClick={onClick}>
        <Language></Language>
        <span className={styles.langText}>{intl(keys.lang, IntlType.preUpper)}</span>
      </div>
      {showLangList ?
        <div className={styles.langList}>
          <LangList onSelect={closeLangList}></LangList>
        </div> : null
      }
    </div>
  );
}

export default Lang;
