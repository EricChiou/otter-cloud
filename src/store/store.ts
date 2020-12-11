import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';

import userReducer from './user.slice';
import systemReducer from './system.slice';
import dialogReducer from 'src/components/Dialog/dialog.slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    system: systemReducer,
    dialog: dialogReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['dialog/addDialog'],
    }
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
