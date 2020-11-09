import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from './store';

interface SystemState {
  bucket: string;
  prefix: string;
}

const initialState: SystemState = {
  bucket: '',
  prefix: '',
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setBucket: (state, action: PayloadAction<string>) => {
      state.bucket = action.payload;
    },
    setPrefix: (state, action: PayloadAction<string>) => {
      state.prefix = action.payload;
    },
  },
});

export const setBucket = (bucket: string): AppThunk => dispatch => {
  const { setBucket } = systemSlice.actions;
  dispatch(setBucket(bucket));
};

export const setPrefix = (prefix: string): AppThunk => dispatch => {
  const { setPrefix } = systemSlice.actions;
  dispatch(setPrefix(prefix));
};

export const selectBucket = (state: RootState) => state.system.bucket;
export const selectPrefix = (state: RootState) => state.system.prefix;

export default systemSlice.reducer;
