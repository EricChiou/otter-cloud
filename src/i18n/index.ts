import { store } from 'src/store/store';

import { Keys } from './interface';

import { langs } from './langs';
import { en_us } from './langs/en-us';
import { zh_tw } from './langs/zh-tw';

export enum IntlType {
  normal = 'normal',
  upper = 'upper',
  lower = 'lower',
  beginUpper = 'beginUpper',
  perUpper = 'perUpper',
}

export type { Langs, Keys } from './interface';
export { langs } from './langs';
export { keys } from './keys';
export const intl = (key: string, type?: IntlType): string => {
  if (!key) { return ''; }

  const lang = store.getState().user.lang;
  let text: string;

  switch (lang) {
    case langs.en:
    case langs.en_us:
      text = getText(key, en_us);
      break;

    case langs.zh:
    case langs.zh_tw:
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

    case IntlType.beginUpper:
      return text.slice(0, 1).toUpperCase() + text.slice(1);

    case IntlType.perUpper:
      const segs = text.split(' ');
      let newText = '';
      segs.forEach((t) => { newText += ' ' + t.slice(0, 1).toUpperCase() + t.slice(1) });
      return newText.slice(1);

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
