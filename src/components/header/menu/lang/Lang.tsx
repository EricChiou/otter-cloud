import React, { FunctionComponent } from 'react';

import LangList from '../../../../components/lang-list/LangList';

import styles from './Lang.module.scss';

interface Props {
  close?: Function
}

const Lang: FunctionComponent<Props> = ({ close }) => {
  const onSelect = () => {
    if (close) {
      close();
    }
  }

  return (
    <div className={styles.lang}>
      <LangList onSelect={onSelect}></LangList>
    </div>
  );
}

export default Lang;
