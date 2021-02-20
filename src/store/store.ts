import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';

import userReducer from './user.slice';
import systemReducer from './system.slice';
import { dialogReducer } from 'src/components/common';

export const store = configureStore({
  reducer: {
    user: userReducer,
    system: systemReducer,
    dialog: dialogReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        'dialog/addDialog',
        'dialog/removeDialog',
        'user/setProfile',
        'system/setFileList',
        'system/setPrefix',
        // 'system/setShareToList',
      ],
    },
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
