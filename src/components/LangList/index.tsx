import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { intl, keys, langs } from 'src/i18n';
import { setLang } from 'src/store/user.slice';
import { UserService } from 'src/service/user-service';

import styles from './style.module.scss';

interface Props {
  onSelect?: Function;
}

const LangList: FunctionComponent<Props> = ({ onSelect }) => {
  const dispatch = useDispatch();

  const chooseLang = (lang: string) => {
    UserService.saveLang2Cookie(lang);
    dispatch(setLang(lang));

    if (onSelect) {
      onSelect();
    }
  };

  return (
    <ul className={styles.langList}>
      <li onClick={() => { chooseLang(langs.enUS); }}>{intl(keys.english)}</li>
      <hr></hr>
      <li onClick={() => { chooseLang(langs.zhTW); }}>{intl(keys.tradChinese)}</li>
    </ul>
  );
};

export default LangList;