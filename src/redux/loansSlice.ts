import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { NFTType } from 'src/types';


export interface LoansState {
  selectedNFTIndex: Number,
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
    setLoans: (state, action: PayloadAction<LoansState>) => {
      state.selectedNFTIndex = action.payload.selectedNFTIndex;
      state.allNFTs = action.payload.allNFTs;
    },
    setSelectedNFTIndex: (state, action: PayloadAction<Number>) => {
      state.selectedNFTIndex = action.payload;
    },
    setAllNFTs: (state, action: PayloadAction<Array<{
      openseaSrc: string;
      collection: string;
      name: string;
      imgSrc: string;
    }>>) => {
      state.allNFTs = action.payload;
    },  
  },
});

export const { setLoans,setSelectedNFTIndex,setAllNFTs } = LoansSlice.actions;
export const selectLoans = (state: RootState) => state.loans;

export default LoansSlice.reducer;
