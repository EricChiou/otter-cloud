import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from 'src/store/store';
import { DialogData } from './index';

interface DialogState {
  buffer: DialogData[];
}

const initialState: DialogState = {
  buffer: [],
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    addDialog: (state, action: PayloadAction<DialogData>) => {
      const buffer = [action.payload, ...state.buffer];
      state.buffer = buffer;
    },
    removeDialog: (state) => {
      const buffer = [...state.buffer];
      buffer.shift();
      state.buffer = buffer;
    },
  },
});

const dialogReducer = dialogSlice.reducer;

export const addDialog = (dialogData: DialogData): AppThunk => (dispatch) => {
  const { addDialog } = dialogSlice.actions;
  dispatch(addDialog(dialogData));
};

export const removeDialog = (): AppThunk => (dispatch) => {
  const { removeDialog } = dialogSlice.actions;
  dispatch(removeDialog());
};

export const selectBuffer = (state: RootState) => state.dialog.buffer;

export { dialogReducer };
