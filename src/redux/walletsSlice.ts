import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface WalletsState {
  provider: {
    on:Function|null;
    removeListener:Function|null;
  };
  library: object;
  account: string;
  error: object;
  chainId: number;
  network: string;
  signer: object;
}

const initialState: WalletsState = {
    provider: {
      on:null,
      removeListener:null
    },
    library: {},
    account: "",
    error: {},
    chainId: 0,
    network: "",
    signer: {}
};

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<object>) => {
      for (const [key,value] of Object.entries(action.payload)){
          state = {
              ...state,
              [key]:value
          }
      }
      return state;
    },
    setProvider: (state, action: PayloadAction<object>) => {
      state.library = action.payload;
      return state;
    },
    setLibrary: (state, action: PayloadAction<object>) => {
      state.library = action.payload;
      return state;
    },
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
      return state;
    },
    setError: (state, action: PayloadAction<object>) => {
      state.error = action.payload;
      return state;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
      return state;
    },  
    setNetwork: (state, action: PayloadAction<string>) => {
      state.network = action.payload;
      return state;
    },     
    setSigner: (state, action: PayloadAction<object>) => {
      state.signer = action.payload;
      return state;
    },     
  },
});

export const { setWallets,setProvider,setLibrary,setAccount,setError,setChainId,setNetwork } = walletsSlice.actions;

export const selectWallets = (state: RootState) => state.wallets;
export default walletsSlice.reducer;
