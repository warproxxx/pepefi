import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface VaultsState {
  provider: Object;
  library: Object;
  account: String;
  error: Object;
  chainId: Number;
  network: String;
}

const initialState: VaultsState = {
    provider: {},
    library: {},
    account: "",
    error: {},
    chainId: 0,
    network: ""
};

export const VaultsSlice = createSlice({
  name: 'vaults',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setVaults: (state, action: PayloadAction<VaultsState>) => {
      state.provider = action.payload.provider;
      state.library = action.payload.library;
      state.account = action.payload.account;
      state.error = action.payload.error;
      state.chainId = action.payload.chainId;
      state.network = action.payload.network;
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload.provider;
    },
    setLibrary: (state, action: PayloadAction<any>) => {
      state.library = action.payload.library;
    },
    setAccount: (state, action: PayloadAction<any>) => {
      state.account = action.payload.account;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload.error;
    },
    setChainId: (state, action: PayloadAction<any>) => {
      state.chainId = action.payload.chainId;
    },  
    setNetwork: (state, action: PayloadAction<any>) => {
      state.network = action.payload.network;
    },     
  },

});

export const { setVaults,setProvider,setLibrary,setAccount,setError,setChainId,setNetwork } = VaultsSlice.actions;

export const selectWallets = (state: RootState) => state.wallets;


export default VaultsSlice.reducer;
