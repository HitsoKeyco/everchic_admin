import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './css/ContactPage.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import getApiRol from '../hooks/rol/getApiRol';
import contactApi from '../hooks/contact/contactApi';
import CardContact from '../components/Modals/Contact/CardContact';
import AddContact from '../components/Modals/Contact/AddContact';
import EditContact from '../components/Modals/Contact/EditContact';
import { useDispatch, useSelector } from 'react-redux';
import { searchContact } from '../store/slices/contact.slice';


const ContactPage = () => {
    //Estado de carga
    const { isLoading, getContacts} = contactApi();
    const { isRolApi, getRol } = getApiRol();
    const [isSearchContact, setIsSearchContact] = useState('');
    

    //Modales
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    
    const dispatch = useDispatch()

    useEffect(() => {
        getRol();
        getContacts();
    }, []);
    
    const contacts = useSelector(state => state.contacts.foundContacts);
    


    const handleAddContact = () => {
        setIsModalCreate(true)
    }


    useEffect(() => {        
            dispatch(searchContact({ searchTerm: isSearchContact }));
    }, [isSearchContact]);


    return (
        <>
            <div className="contact_page_container">
                <div className="contact_page_controllers_user_container">
                    <p className='contact_page_title'>Contactos</p>
                    <div className="contact_page_controller_user">
                        <div className="contact_page_controllers_search_container">
                            <input 
                                type="text" 
                                className='contact_page_search_input'
                                placeholder='Ingrese nombres, apellidos, dni ó rol.'                                 
                                onChange={(e) => setIsSearchContact(e.target.value)}
                                />
                            <i className='bx bx-search-alt contact_page_search_button' ></i>
                        </div>
                        <div className="contact_page_controllers_add_contact_container">
                            <i className='bx bx-add-to-queue contact_page_add' onClick={handleAddContact}></i>
                        </div>
                    </div>
                </div>


                {isLoading ? (
                    <>
                        <Skeleton /> 
                        <Skeleton count={25} /> 
                    </>
                ) : (
                    contacts?.map((contact, index) => (
                        <div className="card_contact_element" key={index}>
                            <CardContact key={index} contact={contact} />
                        </div>

                    ))
                    
                )}


                {isModalCreate && <AddContact isModalCreate={isModalCreate} setIsModalCreate={setIsModalCreate} isRolApi={isRolApi} />}
                {isModalEdit && <EditContact setIsModalEdit={setIsModalEdit} isRolApi={isRolApi} isOneContactApi={isOneContactApi}/>}
            </div>
        </>
    );
};



export default ContactPage;
