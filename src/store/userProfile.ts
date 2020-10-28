import { store } from './store';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

import { UserProfile } from '../vo/common';

const initialState: UserProfile = {
  token: null,
  id: null,
  acc: null,
  name: null,
  role: null,
  lang: 'en-us',
  exp: 0,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<UserProfile>) => {
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.acc = action.payload.acc;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.lang = action.payload.lang;
      state.exp = action.payload.exp;
    },
  },
});

export const setUserProfile = (userProfile: UserProfile) => {
  const { set } = userProfileSlice.actions;
  store.dispatch(set(userProfile));
};

export const selectUserProfile = (state: RootState) => state.userProfile;

export default userProfileSlice.reducer;
