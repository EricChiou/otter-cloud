import { UserProfile } from '../vo/common';

import { store } from '../store/store';

import { Cookie } from '../util/cookie';
import { CookieKeys } from '../constants';

export class UserProfileService {
  public static readonly parseToken = (token: string): UserProfile => {
    const userProfile: UserProfile = {
      token: null,
      id: null,
      acc: null,
      name: null,
      role: null,
      lang: '',
      exp: 0,
    };

    if (!token) { return userProfile; }

    const seg = token.split('.');
    if (seg.length !== 3) { return userProfile; }

    const decode = atob(seg[1]);
    if (!decode) { return userProfile; }

    const parse: UserProfile = JSON.parse(decode);
    if (!parse) { return userProfile; }

    userProfile.token = token;
    userProfile.id = parse.id;
    userProfile.acc = parse.acc;
    userProfile.name = parse.name;
    userProfile.role = parse.role;
    userProfile.lang = parse.lang;
    userProfile.exp = parse.exp;
    return userProfile;
  }

  public static readonly saveToken2Cookie = (token: string, expires: number) => {
    Cookie.add(CookieKeys.TOKEN_KEY, btoa(token), expires / 1000);
  }

  public static readonly getTokenFrCookie = (): string => {
    const base64 = Cookie.get(CookieKeys.TOKEN_KEY);
    try {
      return atob(base64);
    } catch (error) {
      console.error(error);
    }
    return '';
  }
}