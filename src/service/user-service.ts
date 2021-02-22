import { UserProfile } from 'src/interface/common';

import { Cookie } from 'src/util/cookie.util';
import { CookieKeys } from 'src/constants';

export class UserService {
  public static readonly parseToken = (token: string): UserProfile => {
    const userProfile: UserProfile = {
      token: '',
      acc: '',
      name: '',
      roleCode: '',
      exp: 0,
    };

    if (!token) { return userProfile; }

    const seg = token.split('.');
    if (seg.length !== 3) { return userProfile; }

    const decode = decodeURIComponent(atob(seg[1]));
    if (!decode) { return userProfile; }

    const parse: UserProfile = JSON.parse(decode);
    if (!parse) { return userProfile; }

    userProfile.token = token;
    userProfile.acc = parse.acc;
    userProfile.name = parse.name;
    userProfile.roleCode = parse.roleCode;
    userProfile.exp = parse.exp;
    return userProfile;
  };

  public static readonly getTokenFrCookie = (): string => {
    const base64 = Cookie.get(CookieKeys.TOKEN);
    try {
      return atob(base64);
    } catch (error) {
      console.error(error);
    }
    return '';
  };

  public static readonly saveToken2Cookie = (token: string, expires: number) => {
    Cookie.add(CookieKeys.TOKEN, btoa(token), expires);
  }

  public static readonly getLangFrCookie = (): string => {
    const base64 = Cookie.get(CookieKeys.LANG);
    try {
      if (base64) {
        return atob(base64);
      }
    } catch (error) {
      console.error(error);
    }
    return window.navigator.language;
  };

  public static readonly saveLang2Cookie = (lang: string) => {
    Cookie.add(CookieKeys.LANG, btoa(lang), 100 * 365 * 24 * 60 * 60 * 1000); // 100 years
  }
}