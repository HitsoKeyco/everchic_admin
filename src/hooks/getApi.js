import axios from "axios";
import getConfigAuth from "../utils/getConfigAuth";
import { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const getApi = () => {
    const [customers, setCustomers] = useState()
    const MySwal = withReactContent(Swal)
    
    const apiUrl = import.meta.env.VITE_API_URL

    const getCustomers = () => {
        const url = `${apiUrl}/customers`
        axios.get(url, getConfigAuth())
            .then(res => {
                setCustomers(res.data)
            })
            .catch(err => {
                console.log(err);
            });
    }

    const createCustomers = (data) => {
        const url = `${apiUrl}/customers`
        axios.post(url, data, getConfigAuth())
            .then(res => {
                console.log(res.data);
                MySwal.fire({
                    icon: 'success',
                    title: 'Cliente creado con éxito',
                });
            })
            .catch(err => {
                console.log(err);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al crear usuario',
                    text: 'El correo del usuario ya existe',
                });
            });
    }

    const deleteCustomers = (id) => {
        const urlDelete = `${apiUrl}/customers/${id}`;
        axios.delete(urlDelete, getConfigAuth())
            .then((res => {
                console.log(res.data);
                // Muestra una alerta de éxito cuando se elimina un cliente
                MySwal.fire({
                    icon: 'success',
                    title: 'Cliente eliminado con éxito',
                });
            }))
            .catch((err) => {
                console.log(err);
                // Muestra una alerta de error cuando falla la eliminación
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al eliminar cliente',
                    text: 'Hubo un problema al eliminar el cliente. Por favor, inténtalo de nuevo.',
                });
            });
    }

    const getCustomersId = (id) => {
        const urlGetOne = `${apiUrl}/customers/${id}`;
        axios.get(urlGetOne, getConfigAuth())
            .then((res) => {
                setCustomers(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const updateCustomers = (data, id) => {
        const urlUpdate = `${apiUrl}/customers/${id}`;
        axios.put(urlUpdate, data, getConfigAuth())
            .then((res) => {
                setCustomers(res.data)
                MySwal.fire({
                    icon: 'success',
                    title: 'Cliente actualizado con éxito',
                });
            })
            .catch((err) => {
                console.log(err);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al actualizar al cliente',
                    text: 'Probablemete ya existe un usuario con ese correo',
                });
            });
    }

    const searchCustomers = (searchText) => {
        const searchUrl = `${apiUrl}/customers/search?searchText=${searchText}`;
        axios.get(searchUrl, getConfigAuth())
            .then((res) => {
                setCustomers(res.data);                
            })
            .catch((err) => {
                console.log(err);
                
            });
    };


    return { customers, getCustomers, createCustomers, deleteCustomers, getCustomersId, updateCustomers, searchCustomers };
}

export default getApi;
