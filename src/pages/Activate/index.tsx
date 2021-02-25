import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { activateAcc } from 'src/api/user';
import { Routes } from 'src/constants';
import { addMessage, MessageType } from 'src/components/Message';
import { intl, keys, IntlType } from 'src/i18n';

import styles from './style.module.scss';

const Activate: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { avtiveCode }: { avtiveCode: string } = useParams();
  const [className, setClassName] =
    useState(window.innerHeight > window.innerWidth ? styles.vertical : styles.horizontal);

  useEffect(() => {
    const onResize = () => {
      if (window.innerHeight > window.innerWidth) {
        if (className !== styles.vertical) {
          setClassName(styles.vertical);
        }
      } else if (window.innerWidth && className !== styles.horizontal) {
        setClassName(styles.horizontal);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  useEffect(() => {
    if (!avtiveCode) { history.push({ pathname: Routes.LOGIN, search: '' }); }

    activateAcc(avtiveCode).then(() => {
      dispatch(addMessage(
        intl(keys.activateSuccess),
        MessageType.success,
        () => { history.push({ pathname: Routes.LOGIN, search: '' }); },
      ));

    }).catch(() => {
      dispatch(addMessage(
        intl(keys.invalidActiveCode, IntlType.perUpper),
        MessageType.warning,
        () => { history.push({ pathname: Routes.LOGIN, search: '' }); },
      ));
    });

  }, [avtiveCode, dispatch, history]);

  return <div id={styles.avtivate} className={className}></div>;
};

export default Activate;

