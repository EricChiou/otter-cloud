import React, { FunctionComponent, useState } from 'react';

import { Language } from 'src/components/icons';
import { intl, keys, IntlType } from 'src/i18n';
import LangList from 'src/components/LangList';

import styles from './style.module.scss';

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
        <span className={styles.langText}>{intl(keys.lang, IntlType.firstUpper)}</span>
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
