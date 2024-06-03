import { createSlice } from "@reduxjs/toolkit";

const contacts = createSlice({
    name: 'contacts',
    initialState: {
        contactStore: [],
        foundContacts: [],
    },
    reducers: {
        getContactStore: (state, action) => {
            state.contactStore = action.payload;
            // Al cargar los contactos por primera vez, los mostramos todos
            state.foundContacts = action.payload;
        },
        searchContact: (state, action) => {
            const { searchTerm } = action.payload;
            if (!searchTerm) {
                // Si el término de búsqueda es undefined, restablecemos foundContacts a todos los contactos
                state.foundContacts = state.contactStore;
            } else {
                const searchTermLowerCase = searchTerm.toLowerCase();
                const foundContacts = state.contactStore.filter(contact => {
                    const firstNameLowerCase = contact.firstName.toLowerCase();
                    const lastNameLowerCase = contact.lastName.toLowerCase();
                    const rolLowerCase = contact.rol.role.toLowerCase();                    
                    // Convertimos el DNI a cadena de texto para mantener los ceros a la izquierda
                    const dni = contact.dni.toString();
                    return firstNameLowerCase.includes(searchTermLowerCase)
                             || lastNameLowerCase.includes(searchTermLowerCase) 
                             || dni.includes(searchTermLowerCase)
                             || rolLowerCase.includes(searchTermLowerCase);
                });
                state.foundContacts = foundContacts;
            }
        }
    }
});

export const { getContactStore, searchContact } = contacts.actions;
export default contacts.reducer;
