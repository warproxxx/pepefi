import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import walletsReducer from 'src/redux/walletsSlice'
import loansReducer from 'src/redux/loansSlice'
import lendingNFTSlice from 'src/redux/lendingNFTSlice';
import { lendingNFT } from 'src/data/lendingNFT';

export const store = configureStore({
  
  reducer: {
    wallets: walletsReducer, 
    loans: loansReducer,
    lendingNFT: lendingNFTSlice
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
