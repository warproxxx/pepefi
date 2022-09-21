import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface LoadingState {
    open: boolean;
    loading: boolean;
    success: boolean;
    title: String;
}

const initialState: LoadingState = {
    open: false,
    loading: false,
    success: false,
    title: 'Waiting For Wallet Confirmation'
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {

        setLoadingState: (state, action: PayloadAction<LoadingState>) => {
            for (const [key,value] of Object.entries(action.payload)){
                state = {
                    ...state,
                    [key]:value
                }
            }
            return state;
        },
        setTitle: (state, action: PayloadAction<String>) => {
            state.title = action.payload;
            return state;
        },
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
            return state;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            return state;   
        },
        setSuccecss: (state, action: PayloadAction<boolean>) => {
            state.success = action.payload;
            return state;   
        },
        closeModal: (state) => {
            state.open = false;
            setTimeout(() => {
                state = {
                    ...initialState
                }
            }, 1000);
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

export const { setLoadingState,setOpen,setLoading,setSuccecss, reset, setTitle, closeModal} = loadingSlice.actions;

export const selectLoading = (state: RootState) => state.loading;
export default loadingSlice.reducer;
