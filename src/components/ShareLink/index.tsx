import React, { FunctionComponent, useState, useEffect, useRef, RefObject } from 'react';
import { useSelector } from 'react-redux';

import { addDialog } from 'src/components/common';
import { File } from 'src/vo/common';
import { AppThunk } from 'src/store/store';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseButton, BaseInput } from 'src/components/common';
import { Copy, ChevronUp, ChevronDown } from 'src/components/icons';
import { getShareableLinkUrl } from 'src/api/file';
import { selectPrefix } from 'src/store/system.slice';
import { selectUserProfile } from 'src/store/user.slice';

import styles from './style.module.scss';

interface Props {
  file: File;
};

const ShareLink: FunctionComponent<Props> = ({ file }) => {
  const prefix = useSelector(selectPrefix);
  const userProfile = useSelector(selectUserProfile);
  const shareableLinkRef: RefObject<HTMLDivElement> = useRef(null);
  const [shareableLink, setShareableLink] = useState('');
  const [expires, setExpires] = useState({ days: 1, hours: 0, minutes: 0 });

  useEffect(() => {
    const expiresSeconds =
      (expires.days * 24 * 60 * 60) +
      (expires.hours * 60 * 60) +
      (expires.minutes * 60);

    getShareableLinkUrl(
      prefix,
      file.name,
      file.contentType,
      expiresSeconds,
      userProfile.token,
    ).then((resp) => {
      setShareableLink(resp.data.shareableLink);
    });

  }, [shareableLink, file, expires, prefix, userProfile]);

  const changeDays = (value: number) => {
    const newExpires = { ...expires };
    newExpires.days = checkValueRange(newExpires.days + value, 7, 0);
    checkExpires(newExpires);

    setExpires(newExpires);
  }

  const changeHours = (value: number) => {
    const newExpires = { ...expires };
    newExpires.hours = checkValueRange(newExpires.hours + value, 23, 0);
    checkExpires(newExpires);

    setExpires(newExpires);
  }

  const changeMinutes = (value: number) => {
    const newExpires = { ...expires };
    newExpires.minutes = checkValueRange(newExpires.minutes + value, 59, 0);
    checkExpires(newExpires);

    setExpires(newExpires);
  }

  const checkValueRange = (value: number, max: number, min: number): number => {
    return (value > max) ? max : ((value < min) ? min : value);
  };

  const checkExpires = (newExpires: { days: number, hours: number, minutes: number }) => {
    if (newExpires.days >= 7) {
      newExpires.days = 7;
      newExpires.hours = 0;
      newExpires.minutes = 0;
    }

    if (newExpires.days === 0 && newExpires.hours === 0 && newExpires.minutes === 0) {
      newExpires.days = 0;
      newExpires.hours = 0;
      newExpires.minutes = 1;
    }
  }

  const renderExpiresSelector = (value: number, unit: string, pressUp: () => void, pressDown: () => void) => {
    return (
      <div className={styles.expiresSelector}>
        <BaseButton
          style={{ padding: '0 23px', borderRadius: '4px 4px 0 0' }}
          onClick={pressUp}
        >
          <ChevronUp></ChevronUp>
        </BaseButton>
        <div className={styles.expiresValueBlock}>
          <span className={styles.expiresValue}>{value}</span>
          <br />
          <span className={styles.expiresUnit}>{unit}</span>
        </div>
        <BaseButton
          style={{ padding: '0 23px', borderRadius: '0 0 4px 4px' }}
          onClick={pressDown}
        >
          <ChevronDown></ChevronDown>
        </BaseButton>
      </div>
    );
  }

  return (
    <div className={styles.shareLinkBlock}>
      <div className={styles.header}>
        {intl(keys.shareLink, IntlType.perUpper)}
      </div>
      <div className={styles.container}>
        <div ref={shareableLinkRef} className={styles.shareableLink}>
          {intl(keys.shareableLink, IntlType.perUpper)}:
          <BaseInput
            style={{ width: 'calc(100% - 4px - 30px)', height: '24px', borderRadius: '4px 0 0 4px', verticalAlign: 'top' }}
            value={shareableLink}
            readonly={true}
          ></BaseInput>
          <BaseButton
            style={{ padding: '0', borderRadius: '0 4px 4px 0', verticalAlign: 'top' }}
            onClick={() => {
              if (!shareableLinkRef.current) { return; }

              const inputEle = shareableLinkRef.current.getElementsByTagName('input')[0];
              if (!inputEle) { return; }

              inputEle.select();
              inputEle.setSelectionRange(0, 99999);
              document.execCommand('copy');
            }}
          >
            <Copy></Copy>
          </BaseButton>
        </div>
        <div className={styles.expires}>
          {intl(keys.expiresInMaxDay, IntlType.perUpper)}:
          <div className={styles.expiresSelectorBlock}>
            {renderExpiresSelector(
              expires.days,
              intl(keys.days, IntlType.firstUpper),
              () => { changeDays(1); },
              () => { changeDays(-1); },
            )}
            {renderExpiresSelector(
              expires.hours,
              intl(keys.hours, IntlType.firstUpper),
              () => { changeHours(1); },
              () => { changeHours(-1); },
            )}
            {renderExpiresSelector(
              expires.minutes,
              intl(keys.minutes, IntlType.firstUpper),
              () => { changeMinutes(1); },
              () => { changeMinutes(-1); },
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const showShareLinkDialog = (file: File): AppThunk => dispatch => {
  dispatch(addDialog({
    component: <ShareLink file={file}></ShareLink>,
    closeUI: true,
    closeByClick: true,
  }));
};
