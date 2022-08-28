import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface VaultsState {
  selectedVault : number;
  allVaults :Array<
    {
      name: string;
      contractAddy: string;
      etherScanSrc: string;
      data: {
          totalWETH: number;
          LTV: {
              range: Array<number>;
              average: number;
              min: number;
              max: number;
              marks: {
                value: number;
                label: string;
              }
          },
          APR: {
            range: Array<number>;
            average: number;
            min: number;
            max: number;
            marks: {
              value: number;
              label: string;
            }
          },
          duration: number;
          openseaPrice: number;
          oraclePrice: number;
          imgSrc: Array<string>;
      },
      collections:[
          {
              name: string;
              imgSrc: string;
              openseaSrc: string;
              etherScanSrc: string;
              price: string;
              openseaPrice: number;
              oraclePrice: number;
              totalWETH: number;
              LTV: number;
              APR: number;
              duration: number;
              NFTs: [
                  {
                      imgSrc: number;
                      openseaSrc: number;
                      etherScanSrc: number;
                      value: number;
                      duration: number;
                      APR: number;
                      loanAmount: number;
                  }
              ]
          }
      ]
    }
  >
}

const initialState: VaultsState = {
  selectedVault: -1,
  allVaults: []
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
    setAllVaults: (state, action: PayloadAction<object>) => {
      for (const [key,value] of Object.entries(action.payload)){
        state.allVaults = {
          ...state.allVaults,
          [key]:value
        }
      }
      return state;
    },
    setSelectedVault: (state, action: PayloadAction<number>) => {
      state.selectedVault = action.payload;
      return state;
    }
  },
  

});

export const { setVaults, setAllVaults, setSelectedVault } = VaultsSlice.actions;

export const selectVaults = (state: RootState) => state.vaults;


export default VaultsSlice.reducer;
