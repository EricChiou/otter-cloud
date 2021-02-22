import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from './store';
import { Prefix, File, Share } from 'src/interface/common';
import { getFileList } from 'src/api/file';
import { getSharedFolderList, getSharedFileList } from 'src/api/shared';
import { GetFileListResVo } from 'src/api/file/vo';

interface SystemState {
  bucket: string;
  prefix: Prefix;
  fileList: File[];
  fileListOnloading: boolean;
  sharedFolderList: Share[];
}

const initialState: SystemState = {
  bucket: '',
  prefix: { sharedId: null, path: '' },
  fileList: [],
  fileListOnloading: false,
  sharedFolderList: [],
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setBucket: (state, action: PayloadAction<string>) => {
      state.bucket = action.payload;
    },
    setPrefix: (state, action: PayloadAction<Prefix>) => {
      state.prefix = action.payload;
    },
    setFileList: (state, action: PayloadAction<File[]>) => {
      state.fileList = action.payload;
    },
    setFileListOnLoading: (state, action: PayloadAction<boolean>) => {
      state.fileListOnloading = action.payload;
    },
    setFile: (state, action: PayloadAction<{ file: File; index: number }>) => {
      state.fileList[action.payload.index] = action.payload.file;
    },
    setSharedFolderList: (state, action: PayloadAction<Share[]>) => {
      state.sharedFolderList = action.payload;
    },
  },
});

export const setBucket = (bucket: string): AppThunk => (dispatch) => {
  const { setBucket } = systemSlice.actions;
  dispatch(setBucket(bucket));
};

export const setPrefix = (sharedId: number | null, path: string): AppThunk => (dispatch) => {
  const { setPrefix } = systemSlice.actions;
  dispatch(setPrefix({ sharedId, path }));
};

export const setFileList = (fileList: File[]): AppThunk => (dispatch) => {
  const { setFileList } = systemSlice.actions;
  dispatch(setFileList(fileList));
};

export const setFile = (file: File, index: number): AppThunk => (dispatch) => {
  const { setFile } = systemSlice.actions;
  dispatch(setFile({ file, index }));
};

export const updateFileList = (
  prefix: Prefix,
  token: string,
): AppThunk => (dispatch) => {
  const { setFileList, setFileListOnLoading } = systemSlice.actions;

  const getFileListApi = (): Promise<GetFileListResVo> => {
    return prefix.sharedId ?
      getSharedFileList(prefix.sharedId, prefix.path, token) :
      getFileList(prefix.path, token);
  };

  dispatch(setFileListOnLoading(true));
  getFileListApi().then((resp) => {

    const fileList: File[] = resp.data.map((file) => {
      const fileNameSep = file.name.split('/');
      const length = fileNameSep.length;
      return {
        contentType: file.contentType,
        name: fileNameSep[length - 1] ? fileNameSep[length - 1] : fileNameSep[length - 2] + '/',
        size: file.size,
        lastModified: file.lastModified,
        selected: false,
      };
    });

    dispatch(setFileList(fileList));

  }).catch((error) => {
    console.log(error);
    dispatch(setFileList([]));

  }).finally(() => {
    dispatch(setFileListOnLoading(false));
  });
};

export const updateSharedFolderList = (token: string): AppThunk => (dispatch) => {
  getSharedFolderList(token).then((resp) => {
    const shareToList = resp.data.map((sharedFolder) => ({
      id: sharedFolder.id,
      ownerAcc: sharedFolder.ownerAcc,
      ownerName: sharedFolder.ownerName,
      sharedAcc: sharedFolder.sharedAcc,
      sharedName: sharedFolder.sharedName,
      prefix: sharedFolder.prefix,
      permission: sharedFolder.permission,
      createdDate: 0,
      updatedDate: 0,
    }));

    const { setSharedFolderList } = systemSlice.actions;
    dispatch(setSharedFolderList(shareToList));

  }).catch(() => {
    // do nothing
  });
};

export const selectBucket = (state: RootState) => state.system.bucket;
export const selectPrefix = (state: RootState) => state.system.prefix;
export const selectFileList = (state: RootState) => state.system.fileList;
export const selectFileListOnLoading = (state: RootState) => state.system.fileListOnloading;
export const selectSharedFolderList = (state: RootState) => state.system.sharedFolderList;

export default systemSlice.reducer;
