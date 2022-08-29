import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface MyLoansState {
    allLoans:[
        {
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
    ] | []
}

const initialState: MyLoansState = {
    allLoans: []
};

export const MyLoansSlice = createSlice({
  name: 'myLoans',
  initialState,
    reducers: {
        setMyLoans: (state, action: PayloadAction<any>) => {
            state.allLoans = action.payload;
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
