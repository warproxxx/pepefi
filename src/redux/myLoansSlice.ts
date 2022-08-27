import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface MyLoansState {
    imgSrc: string;
    name: string;
    collection: string;
    lendedVault: string;
    APR: number;
    loanAmount: number;
    loanDate: string;
    remainingDays: number;
    repaymentAmount: number;
    action: string;
}

const initialState: MyLoansState = {
    imgSrc: '',
    name: '',
    collection: '',
    lendedVault: '',
    APR: 0,
    loanAmount: 0,
    loanDate: '',
    remainingDays: 0,
    repaymentAmount: 0,
    action: ''
};

export const MyLoansSlice = createSlice({
  name: 'myLoans',
  initialState,
    reducers: {
        setMyLoans: (state, action: PayloadAction<object>) => {
            for (const [key,value] of Object.entries(action.payload)){
                state = {
                    ...state,
                    [key]:value
                }
            }
            return state;
        },
        clearMyLoans: (state) =>{
            state = {...initialState};
            return state;
        }
    }
});

export const { setMyLoans,clearMyLoans } = MyLoansSlice.actions;
export const selectMyLoans = (state: RootState) => state.myLoans;

export default MyLoansSlice.reducer;
