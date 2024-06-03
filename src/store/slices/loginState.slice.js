import { createSlice } from '@reduxjs/toolkit';

export const loginState = createSlice({
    name: 'loginState',
    initialState: false,
    reducers: {
        setLoginState: (state, action) => action.payload,        
    }
})

export const { setLoginState } = loginState.actions;
export default loginState.reducer;

export const loginStateThunk = ( state ) => ( dispatch ) => {
    dispatch(setLoginState(state))
}



