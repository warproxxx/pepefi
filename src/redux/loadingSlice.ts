import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface LoadingState {
    loading: boolean;
    success: boolean;
}

const initialState: LoadingState = {
    loading: false,
    success: false
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
        return state;   
        },
        setSuccecss: (state, action: PayloadAction<boolean>) => {
            state.success = action.payload;
            return state;   
        },
        reset: (state)=>{
            state = {
                ...initialState
            }
            return state;
        }
    }
});

export const { setLoading,setSuccecss,reset} = loadingSlice.actions;

export const selectLoading = (state: RootState) => state.loading;
export default loadingSlice.reducer;
