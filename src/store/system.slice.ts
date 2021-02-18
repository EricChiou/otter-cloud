import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from './store';
import { File, Share } from 'src/vo/common';
import { getShareFolderList } from 'src/api/share';

interface SystemState {
  bucket: string;
  prefix: string;
  fileList: File[];
  shareToList: Share[];
  sharedList: Share[];
}

const initialState: SystemState = {
  bucket: '',
  prefix: '',
  fileList: [],
  shareToList: [],
  sharedList: [],
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
    setFile: (state, action: PayloadAction<{ file: File; index: number }>) => {
      state.fileList[action.payload.index] = action.payload.file;
    },
    setShareToList: (state, action: PayloadAction<Share[]>) => {
      state.shareToList = action.payload;
    },
  },
});

export const setBucket = (bucket: string): AppThunk => (dispatch) => {
  const { setBucket } = systemSlice.actions;
  dispatch(setBucket(bucket));
};

export const setPrefix = (prefix: string): AppThunk => (dispatch) => {
  const { setPrefix } = systemSlice.actions;
  dispatch(setPrefix(prefix));
};

export const setFileList = (fileList: File[]): AppThunk => (dispatch) => {
  const { setFileList } = systemSlice.actions;
  dispatch(setFileList(fileList));
};

export const setFile = (file: File, index: number): AppThunk => (dispatch) => {
  const { setFile } = systemSlice.actions;
  dispatch(setFile({ file, index }));
};

export const updateShareToList = (token: string): AppThunk => (dispatch) => {
  getShareFolderList(token).then((resp) => {
    const shareToList = resp.data.map((shareToFolder) => ({
      id: shareToFolder.id,
      ownerAcc: '',
      ownerName: '',
      sharedAcc: shareToFolder.sharedAcc,
      sharedName: shareToFolder.sharedName,
      prefix: shareToFolder.prefix,
      permission: shareToFolder.permission,
      createdDate: 0,
      updatedDate: 0,
    }));

    const { setShareToList } = systemSlice.actions;
    dispatch(setShareToList(shareToList));

  }).catch(() => {
    // do nothing
  });
};

export const selectBucket = (state: RootState) => state.system.bucket;
export const selectPrefix = (state: RootState) => state.system.prefix;
export const selectFileList = (state: RootState) => state.system.fileList;
export const selectShareToList = (state: RootState) => state.system.shareToList;
export const selectSharedListList = (state: RootState) => state.system.sharedList;

export default systemSlice.reducer;
