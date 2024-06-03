import { Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import HomePage from '../page/HomePage';
import ContactPage from '../page/ContactPage';
import OrderPage from '../page/OrderPage';
import FinancePage from '../page/FinancePage';
import InventoryPage from '../page/InventoryPage';
import ProfilePage from '../page/ProfilePage';


const Links = () => {
    


    return (
        <>          
                   
            <Routes>                
                <Route path='/' element={<HomePage/>}/>
                <Route path='contacts' element={<ContactPage/>}/>                
                <Route path='orders' element={<OrderPage/>}/>
                <Route path='finance' element={<FinancePage/>}/>
                <Route path='inventory' element={<InventoryPage/>}/>
                <Route path='profile' element={<ProfilePage/>}/>
            </Routes>
        </>
    );
};

export default Links;