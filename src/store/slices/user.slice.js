import { createSlice } from '@reduxjs/toolkit';

const userString = localStorage.getItem('user')
let user = userString ? JSON.parse(userString) : false

export const loginState = createSlice({
    name: 'user',
    initialState: user,
    reducers: {        
        setUser: (state, action) => action.payload
    }
})

export const { setUser } = loginState.actions;

export default loginState.reducer;


export const setUserThunk = ( state ) => ( dispatch ) => {
    dispatch(setUser(state))
}


