import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from './store';
import { UserProfile } from 'src/interface/common';
import { Cookie } from 'src/util/cookie.util';
import { CookieKeys } from 'src/constants';
import { UserService } from 'src/service/user-service';
import { setFileList } from './system.slice';

interface UseState {
  profile: UserProfile;
  lang: string;
}

const initialState: UseState = {
  profile: {
    token: '',
    acc: '',
    name: '',
    roleCode: '',
    ip: '',
    exp: 0,
  },
  lang: UserService.getLangFrCookie(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setLang: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
  },
});

export const setUserProfile = (userProfile: UserProfile): AppThunk => (dispatch) => {
  const { setProfile } = userSlice.actions;
  dispatch(setProfile(userProfile));
};

export const setLang = (lang: string): AppThunk => (dispatch) => {
  const { setLang } = userSlice.actions;
  dispatch(setLang(lang));
};

export const logout = (): AppThunk => (dispatch) => {
  Cookie.remove(CookieKeys.TOKEN);

  const userProfile: UserProfile = {
    token: '',
    acc: '',
    name: '',
    roleCode: '',
    ip: '',
    exp: 0,
  };
  const { setProfile } = userSlice.actions;
  dispatch(setFileList([]));
  dispatch(setProfile(userProfile));
};

export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectLang = (state: RootState) => state.user.lang;

export default userSlice.reducer;
