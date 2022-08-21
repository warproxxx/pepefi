import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import walletsReducer from 'src/redux/walletsSlice'

export const store = configureStore({
  
  reducer: {
    wallets: walletsReducer, 
  },
  middleware: (getDefaultMiddleware:any) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
