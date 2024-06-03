import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import contactApi from '../../../hooks/contact/contactApi';
import './css/AddContact.css'

const AddContact = ({ setIsModalCreate, isRolApi }) => {

    // ----- Hooks ------
    const { createContact } = contactApi();    
    const { register, handleSubmit, formState: { errors } } = useForm();

    // ----- Handle modal ------
    const handleModal = () => {
        setIsModalCreate(false)
    }

    // ----- Event submit form ------
    const submit = async (data) => {
        createContact(data);
        setIsModalCreate(false);
    }

    return (
        <div className="add_contact_container">
            {/*------------------------------\\ backdrop //-----------------------------------*/}
            <div className="add_contact_backdrop" onClick={handleModal}></div>
            {/*------------------------------\\ form //-----------------------------------*/}
            <form className="add_contact_form" onSubmit={handleSubmit(submit)}>
            {/*------------------------------\\ Title component //-----------------------------------*/}
                <div className=''>
                    <p className='add_contact_title'>Agregar Contacto</p>
                </div>
                <div className=''>
                    <div className="">
                        {/*------------------------------\\ dni //-----------------------------------*/}
                        <div className=''>
                            <label className="add_contact_label" htmlFor="dni">
                                Cédula | RUC
                            </label>
                            <input
                                type="number"
                                id="dni"
                                name="dni"
                                className={`add_contact_input ${errors.dni ? 'input-error' : ''}`}
                                {...register('dni', { required: 'Este campo es obligatorio' })}
                            />

                        </div>

                        {/*------------------------------\\ Rol //-----------------------------------*/}
                        <div className=''>
                            <label htmlFor="rolId" className='add_contact_label'>Rol</label>
                            <select 
                                name="rolId" 
                                id="rolId" 
                                className={`add_contact_select ${errors.rolId ? 'input-error' : ''}`}
                                {...register('rolId', { required: 'Este campo es obligatorio' })}
                            >
                                <option value='' defaultValue>Seleccione uno</option>
                                {isRolApi?.map((rol) => (
                                    <option key={rol.id} value={rol.id}>
                                        {rol.role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/*------------------------------\\ Company //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="company">
                                Empresa
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                className="add_contact_company"
                                {...register('company')}
                            />
                        </div>
                    </div>

                    <div className="">

                        {/*------------------------------\\ FirstName //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="firstName">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className={`add_contact_input ${errors.firstName? 'input-error' : ''}`}
                                {...register('firstName', { required: 'Este campo es obligatorio' })}
                            />
                        </div>

                        {/*------------------------------\\ LastName //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="lastName">
                                Apellidos
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className={`add_contact_input ${errors.lastName ? 'input-error' : ''}`}
                                {...register('lastName', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                    </div>
                    <div className="">

                        {/*------------------------------\\ Phone //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="phone">
                                Telefono
                            </label>
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                className={`add_contact_input ${errors.phone ? 'input-error' : ''}`}
                                {...register('phone', { required: 'Este campo es obligatorio' })}
                            />
                        </div>

                        {/*------------------------------\\ Email //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="add_contact_input"
                                {...register('email')}
                            />
                        </div>
                    </div>
                    <div className="">

                        {/*------------------------------\\ Address //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="addrees">
                                Direccion
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className={`add_contact_input ${errors.address ? 'input-error' : ''}`}
                                {...register('address', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                    </div>
                    <div className="">

                        {/*------------------------------\\ Country //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="country">
                                Pais
                            </label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                className={`add_contact_input ${errors.country ? 'input-error' : ''}`}
                                defaultValue='Ecuador'
                                {...register('country', { required: 'Este campo es obligatorio' })}
                            />
                        </div>

                        {/*------------------------------\\ City //-----------------------------------*/}
                        <div className="">
                            <label className="add_contact_label" htmlFor="country">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                id='city'
                                name='city'
                                className={`add_contact_input ${errors.city ? 'input-error' : ''}`}
                                {...register('city', { required: 'Este campo es obligatorio' })}
                            />
                        </div>

                    </div>
                </div>

                {/*------------------------------\\ Buttons accions //-----------------------------------*/}
                <div className="add_contact_buttons_container">
                    <button
                        type="submit"
                        className=""
                    >
                        Agregar
                    </button>
                    <button
                        type='submit'
                        className="add_contact_cancel"
                        onClick={() => setIsModalCreate(false)}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddContact;
