import React, { useEffect, useState } from 'react'
import './css/CardContact.css'
import ModalContact from './ModalContact';
import contactApi from '../../../hooks/contact/contactApi';
import EditContact from './EditContact';
import getApiRol from '../../../hooks/rol/getApiRol';

const CardContact = ({ contact }) => {

    const [ isModalContact, setIsModalContact ] = useState(false);
    const [ isModalEditContact, setIsModalEditContact ] = useState(false);
    const { isContactApi, getContact, createContact, deleteContact, getOneContact, updateContact, isOneContactApi } = contactApi();
    const { isRolApi,  getRol } = getApiRol()

    const handleModalContact = (e) => {        
        setIsModalContact(true)        
    }

    const handleModalEditContact = (e) => {        
        setIsModalEditContact(false)        
    }

    const handleEditContact = (e) => {
        e.stopPropagation();
        setIsModalEditContact(true)
        
    }

    const handleDeleteContact = (e) => {
        e.stopPropagation();
        deleteContact(contact.id)
    }

    useEffect (() => {
        getRol()
        
    },[])

    

    return (
        <>
            <div className={`card_contact_container ${(contact.rol.role).toLowerCase()}`} onClick={handleModalContact}>
                <div className='card_contact_title_container'>
                    <p className={`card_contact_name`}>{contact.firstName + ' ' + contact.lastName} </p>
                    
                    <p className={`card_contact_phone`}> {contact.company ? ` Empresa: ${contact.company}`: `CI: ${contact.dni}` }</p>
                    <p className={`card_contact_rol`}>{contact.rol.role}</p>

                    <div className="card_contact_actions">
                        <i className={`bx bxs-edit card_contact_button_edit ${(contact.rol.role).toLowerCase()}`} onClick={handleEditContact}></i>
                        <i className={`bx bxs-trash card_contact_button_delete ${(contact.rol.role).toLowerCase()}`}onClick={handleDeleteContact}></i>
                    </div>
                </div>
            </div>
            {
                isModalContact && <ModalContact setIsModalContact={setIsModalContact} contact={contact}/>
            }
            {
                isModalEditContact && <EditContact handleModalEditContact={handleModalEditContact} contact={contact} isRolApi={isRolApi}/>
            }
        </>
    )
}

export default CardContact