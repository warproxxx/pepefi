import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { AvaliableVaultType } from 'src/types';


export interface LendingNFTState {
    name: string;
    openseaSrc: string;
    collection: string;
    imgSrc: string;
    valuation: number;
    loanAmountMin: number;
    loanAmountMax : number;
    loanAmountSliderStep: number;
    loanAmount: number;
    avaliableVaults: Array<{
        name: string;
        APR: number;
        duration: number;
    }>;
    avaliableVaultsStrs:Array<string>;
    selectedValutIndex: number;
    repayment: number;
    duration: number;
    repaymentDate: string;
}

const initialState: LendingNFTState = {
    name: '',
    openseaSrc: '',
    collection: '',
    imgSrc: '',
    valuation: 0.0,
    loanAmountMin: 0.0,
    loanAmountMax : 10.0,
    loanAmountSliderStep: 0.01,
    loanAmount: 0.0,
    avaliableVaults: [],
    avaliableVaultsStrs:[],
    selectedValutIndex: 0,
    repayment: 1.0,
    duration: 1.0,
    repaymentDate: '',
};

export const LendingNFTSlice = createSlice({
  name: 'lendingNFT',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setLendingNFT: (state, action: PayloadAction<object>) => {
            for (const [key,value] of Object.entries(action.payload)){
                state = {
                    ...state,
                    [key]:value
                }
            }
            return state;
        },
    }
});

export const { setLendingNFT } = LendingNFTSlice.actions;
export const selectLendingNFT = (state: RootState) => state.lendingNFT;

export default LendingNFTSlice.reducer;
