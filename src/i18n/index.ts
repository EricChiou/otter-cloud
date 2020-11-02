import { store } from '../store/store';

import { Keys } from './interface';

import { keys as ks } from './keys';
import { langs as ls } from './langs';
import { en_us } from './langs/en-us';
import { zh_tw } from './langs/zh-tw';

export enum IntlType {
  normal = 'normal',
  upper = 'upper',
  lower = 'lower',
  preUpper = 'preUpper',
}

export const keys = ks;
export const langs = ls;
export const intl = (key: string, type?: IntlType): string => {
  if (!key) { return ''; }

  const userProfile = store.getState().user.profile;
  const lang = userProfile ? userProfile.lang : '';
  let text: string;

  switch (lang) {
    case ls.en_us:
      text = getText(key, en_us);
      break;

    case ls.zh_tw:
      text = getText(key, zh_tw);
      break;

    default:
      text = getDefaultText(key);
      break;
  }

  switch (type) {
    case IntlType.upper:
      return text.toUpperCase();

    case IntlType.lower:
      return text.toLowerCase();

    case IntlType.preUpper:
      return text.slice(0, 1).toUpperCase() + text.slice(1);

    default:
      return text;
  }
}

const getText = (key: string, text: Keys): string => {
  if (text[key]) {
    return text[key];
  }

  return getDefaultText(key);
};

const getDefaultText = (key: string): string => {
  const keySplit = key.split('_');
  return keySplit[keySplit.length - 1];
}
