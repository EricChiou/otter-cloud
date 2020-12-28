import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from './store';
import { File } from 'src/pages/Home/FileList/File';

interface SystemState {
  bucket: string;
  prefix: string;
  fileList: File[];
}

const initialState: SystemState = {
  bucket: '',
  prefix: '',
  fileList: [],
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
    setFileList: (state, action: PayloadAction<File[]>) => {
      state.fileList = action.payload;
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

export const setFileList = (fileList: File[]): AppThunk => dispatch => {
  const { setFileList } = systemSlice.actions;
  dispatch(setFileList(fileList));
};

export const selectBucket = (state: RootState) => state.system.bucket;
export const selectPrefix = (state: RootState) => state.system.prefix;
export const selectFileList = (state: RootState) => state.system.fileList;

export default systemSlice.reducer;
