import React from 'react'
import './css/ModalContact.css'

const ModalContact = ({ setIsModalContact, contact }) => {
    return (
        <>
        <div className="modal_contact_container">
            <div className="modal_contact_backdrop" onClick={() => setIsModalContact(false)}></div>
            <div className="modal_contact_info_container">
                <ul>
                    <li className='contact_modal_name'>{contact.firstName + ' ' + contact.lastName}</li>
                    <li>Cedula: {contact.dni}</li>
                    <li>Email: {contact.email}</li>
                    <li>Empresa: {contact.company}</li>
                    <li>Cell: {contact.phone}</li>
                    <li>Dir: {contact.address}</li>
                    <li>Pais: {contact.country}</li>
                </ul>
            </div>
        </div>
        </>
    )
}

export default ModalContact