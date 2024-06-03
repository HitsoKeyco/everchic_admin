import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import getConfigAuth from "../../utils/getConfigAuth";
import { useDispatch } from "react-redux";
import { getContactStore } from "../../store/slices/contact.slice";

const contactApi = () => {
    const [isLoading, setIsLoading] = useState(false);        
    const dispatch = useDispatch();
    const apiUrl = import.meta.env.VITE_API_URL
    const path = '/contacts/'
    const MySwal = withReactContent(Swal)


    //Petición Contactos
    //------------------------------------------------------------------------------
    const getContacts = () => {
        const url = `${apiUrl + path}`
        setIsLoading(true);
        axios.get(url, getConfigAuth())
            .then(res => {                
                dispatch(getContactStore(res.data))
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener los contactos:', err);
            })
    }
    //------------------------------------------------------------------------------


    // Crear Contacto
    //------------------------------------------------------------------------------
    const createContact = (data) => {
        const url = `${apiUrl + path}`
        setIsLoading(true);
        axios.post(url, data, getConfigAuth())
        .then(res => {                
                getContacts()
                MySwal.fire({
                    icon: 'success',
                    title: `${res.data.firsName }Contacto creado con éxito`,
                });
                setIsLoading(false);
            })
            .catch(err => {                
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al crear contacto',
                    text: 'Hubo un problema al crear el contacto. Por favor, inténtalo de nuevo.',
                });
            })
    }

    //------------------------------------------------------------------------------


    // Eliminar Contacto
    //------------------------------------------------------------------------------
    const deleteContact = (id) => {
        const url = `${apiUrl + path + id}`;
        setIsLoading(true);        
        axios.delete(url, getConfigAuth())
            .then((res => {
                getContacts()
                MySwal.fire({
                    icon: 'success',
                    title: 'Contacto eliminado con éxito',
                });
                setIsLoading(false);
            }))
            .catch((err) => {
                console.log(err);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al eliminar contacto',
                    text: 'Hubo un problema al eliminar el contacto. Por favor, inténtalo de nuevo.',
                });
            });
    }

    //------------------------------------------------------------------------------


    // Buscar contacto
    //------------------------------------------------------------------------------
    const getOneContact = (id) => {
        const url = `${apiUrl + path + id}`;
        setIsLoading(true);
        axios.get(url, getConfigAuth())
            .then((res) => {                
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });

    }


    //------------------------------------------------------------------------------


    // Actualizar contacto
    //------------------------------------------------------------------------------
    const updateContact = (data, id) => {
        const url = `${apiUrl + path + id}`;
        setIsLoading(true);
        axios.put(url, data, getConfigAuth())
            .then((res) => {
                getContacts();               
                MySwal.fire({
                    icon: 'success',
                    title: 'Contacto actualizado con éxito',
                });
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al actualizar contacto',
                });
            });
    }


    return { isLoading, getContacts, createContact, deleteContact, getOneContact, updateContact }
}

export default contactApi;
