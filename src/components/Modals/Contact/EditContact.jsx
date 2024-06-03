import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import contactApi from '../../../hooks/contact/contactApi';
import './css/EditContact.css'

const EditContact = ({ handleModalEditContact, isRolApi, updateData, contact }) => {

    // ----- Hooks ------
    const { updateContact } = contactApi();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // ----- Handdle modal ------
    const handleModal = (e) => {
        e.preventDefault();
        handleModalEditContact(false);
    }

    // ----- Event submit form ------
    const submit = async (data) => {
        await updateContact(data, contact.id);
        setTimeout(updateData, 2000);
        handleModalEditContact(false);
    }

    return (
        <>
            <div className="edit_contact_container">
                {/*------------------------------\\ backdrop //-----------------------------------*/}
                <div className="edit_contact_backdrop" onClick={handleModal}></div>
                {

                    /*------------------------------\\ form //-----------------------------------*/
                    <form id='myForm' className="edit_contact_form" onSubmit={handleSubmit(submit)}>
                        {/*----------------------\\ Title component //--------------------------*/}
                        <div className=''>
                            <p className='edit_contact_title'>Editar Contacto</p>
                        </div>

                        <div className=''>
                            <div className="">

                                {/*------------------------------\\ Dni //-----------------------------------*/}
                                <div className=''>
                                    <label className="edit_contact_label" htmlFor="dni">
                                        Cédula | RUC
                                    </label>
                                    <input
                                        type="number"
                                        id="dni"
                                        name="dni"
                                        className={`edit_contact_input ${errors.dni ? 'input-error' : ''}`}
                                        defaultValue={contact.dni}
                                        {...register('dni', { required: 'Este campo es obligatorio' })}
                                    />
                                </div>

                                {/*------------------------------\\ Rol //-----------------------------------*/}
                                <div className=''>
                                    <label htmlFor="rolId" className='edit_contact_label'>Rol</label>
                                    <select
                                        name="rolId"
                                        id="rolId"
                                        className={`edit_contact_input ${errors.rolId ? 'input-error' : ''}`}
                                        {...register('rolId', { required: 'Este campo es obligatorio' })}
                                        defaultValue={contact.rolId}
                                        onChange={(e) => setValue('rolId', e.target.value)}
                                    >
                                        {isRolApi?.map((rol) => (
                                            <option key={rol.id} value={rol.id}>
                                                {rol.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/*------------------------------\\ Company //-----------------------------------*/}
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="company">
                                        Empresa
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        className={`edit_contact_input ${errors.company ? 'input-error' : ''}`}
                                        defaultValue={contact.company}
                                        {...register('company')}
                                    />
                                </div>
                            </div>

                            {/*------------------------------\\ FirstName //-----------------------------------*/}
                            <div className="">
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="firstName">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className={`edit_contact_input ${errors.firstName ? 'input-error' : ''}`}
                                        defaultValue={contact.firstName}
                                        {...register('firstName', { required: 'Este campo es obligatorio' })}
                                    />
                                </div>

                                {/*------------------------------\\ LastName //-----------------------------------*/}
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="lastName">
                                        Apellidos
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className={`edit_contact_input ${errors.lastName ? 'input-error' : ''}`}
                                        defaultValue={contact.lastName}
                                        {...register('lastName', { required: 'Este campo es obligatorio' })}
                                    />
                                </div>
                            </div>
                            <div className="">

                                {/*------------------------------\\ Phone //-----------------------------------*/}
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="phone">
                                        Telefono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className={`edit_contact_input ${errors.phone ? 'input-error' : ''}`}
                                        defaultValue={contact.phone}
                                        {...register('phone', { required: 'Este campo es obligatorio' })}
                                    />
                                </div>

                                {/*------------------------------\\ Enail //-----------------------------------*/}
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`edit_contact_input ${errors.email ? 'input-error' : ''}`}
                                        defaultValue={contact.email}
                                        {...register('email')}
                                    />
                                </div>
                            </div>
                            <div className="">

                                {/*------------------------------\\ Address //-----------------------------------*/}
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="addrees">
                                        Direccion
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className={`edit_contact_input ${errors.address ? 'input-error' : ''}`}
                                        defaultValue={contact.address}
                                        {...register('address', { required: 'Este campo es obligatorio' })}
                                    />
                                </div>
                            </div>
                            <div className="">
                                {/*------------------------------\\ Country //-----------------------------------*/}
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="country">
                                        Pais
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        className={`edit_contact_input ${errors.country ? 'input-error' : ''}`}
                                        defaultValue={contact.country}
                                        {...register('country', { required: 'Este campo es obligatorio' })}
                                    />
                                </div>
                                {/*------------------------------\\ City //-----------------------------------*/}
                                <div className="">
                                    <label className="edit_contact_label" htmlFor="country">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className={`edit_contact_input ${errors.city ? 'input-error' : ''}`}
                                        defaultValue={contact.city}
                                        {...register('city', { required: 'Este campo es obligatorio' })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/*------------------------------\\ Buttons accions //-----------------------------------*/}
                        <div className="edit_contact_buttons_container">
                            <button
                                type="submit"
                                form="myForm"
                                className=""
                            >
                                Actualizar
                            </button>
                            <button
                                className="edit_contact_button_cancel"
                                onClick={handleModal}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                }
            </div>
        </>
    );
};

export default EditContact;
