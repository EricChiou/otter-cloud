import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserProfile } from '../vo/common';

import { RootState, AppThunk } from './store';

interface UseState {
  profile: UserProfile;
}

const initialState: UseState = {
  profile: {
    token: null,
    id: null,
    acc: null,
    name: null,
    role: null,
    lang: 'en-us',
    exp: 0,
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
  },
});

export const setUserProfile = (userProfile: UserProfile): AppThunk => dispatch => {
  const { set } = userSlice.actions;
  dispatch(set(userProfile));
};

export const selectUserProfile = (state: RootState) => state.user.profile;

export default userSlice.reducer;
