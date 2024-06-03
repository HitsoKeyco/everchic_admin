import { configureStore } from "@reduxjs/toolkit";
import loginState from "./slices/loginState.slice";
import sectionPage from "./slices/sectionPage.slice";
import user from "./slices/user.slice";
import contacts from "./slices/contact.slice"
import products from "./slices/products.slice"

export default configureStore({
    reducer: {
        loginState,
        user,
        sectionPage,
        contacts,
        products,
    }
})