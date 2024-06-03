import { createSlice } from '@reduxjs/toolkit';

export const sectionPage = createSlice({
    name: 'sectionPage',
    initialState: 'contactos',
    reducers: {
        setSectionPage: (state, action) => action.payload
    }
})

export const { setSectionPage } = sectionPage.actions;
export default sectionPage.reducer;

export const sectionStateThunk = ( state ) => ( dispatch ) => {
    dispatch(setSectionPage(state))
}


