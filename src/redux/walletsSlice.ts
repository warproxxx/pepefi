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
    network: ""
};

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<WalletsState>) => {
            for (const [key,value] of Object.entries(action.payload)){
                state = {
                    ...state,
                    [key]:value
                }
            }
            return state;
        },
    setProvider: (state, action: PayloadAction<object>) => {
      state.library = action.payload
    },
    setLibrary: (state, action: PayloadAction<object>) => {
      state.library = action.payload;
    },
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
    setError: (state, action: PayloadAction<object>) => {
      state.error = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },  
    setNetwork: (state, action: PayloadAction<string>) => {
      state.network = action.payload;
    },     
  },
});

export const { setWallets,setProvider,setLibrary,setAccount,setError,setChainId,setNetwork } = walletsSlice.actions;

export const selectWallets = (state: RootState) => state.wallets;
export default walletsSlice.reducer;
