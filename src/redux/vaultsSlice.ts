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
    setVaults: (state, action: PayloadAction<object>) => {
      for (const [key,value] of Object.entries(action.payload)){
          state = {
              ...state,
              [key]:value
          }
      }
      return state;
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload.provider;
      return state;
    },   
  },

});

export const { setVaults,setProvider,setLibrary,setAccount,setError,setChainId,setNetwork } = VaultsSlice.actions;

export const selectWallets = (state: RootState) => state.wallets;


export default VaultsSlice.reducer;
