import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface LoansState {
  selectedNFTIndex: number,
  allNFTs:Array<{
    openseaSrc: string;
    collection: string;
    name: string;
    imgSrc: string;
}>
}

const initialState: LoansState = {
  selectedNFTIndex: 0,
  allNFTs:[]
};

export const LoansSlice = createSlice({
  name: 'loans',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setLoans: (state, action: PayloadAction<object>) => {
      for (const [key,value] of Object.entries(action.payload)){
          state = {
              ...state,
              [key]:value
          }
      }
      return state;
  },
    setSelectedNFTIndex: (state, action: PayloadAction<number>) => {
      state.selectedNFTIndex = action.payload;
      return state;
    },
    setAllNFTs: (state, action: PayloadAction<Array<{
      openseaSrc: string;
      collection: string;
      name: string;
      imgSrc: string;
    }>>) => {
      state.allNFTs = action.payload;
    },  
    clearLoans: (state) => {
      state = {...initialState};
      return state;
    },
  },
});

export const { setLoans,setSelectedNFTIndex,setAllNFTs,clearLoans } = LoansSlice.actions;
export const selectLoans = (state: RootState) => state.loans;

export default LoansSlice.reducer;
