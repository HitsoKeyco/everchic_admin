import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import getConfigAuth from "../../utils/getConfigAuth";


const getApiRol = () => {
    const [isRolApi, setIsRolApi] = useState()
    const MySwal = withReactContent(Swal)

    const apiUrl = import.meta.env.VITE_API_URL
    
    const getRol = () => {
        const url = `${apiUrl}/roles`
        axios.get(url, getConfigAuth())
            .then(res => {
                setIsRolApi(res.data)
            })
            .catch(err => {
                console.log(err);
            });
    }

    const createRol = (data) => {
        const url = `${apiUrl}/roles`
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
                    title: 'Error al crear rol',
                    text: 'El rol puede que ya exista',
                });
            });
    }

    const deleteRol = (id) => {
        const urlDelete = `${apiUrl}/roles/${id}`;
        axios.delete(urlDelete, getConfigAuth())
            .then((res => {
                console.log(res.data);                
                MySwal.fire({
                    icon: 'success',
                    title: 'Rol eliminado con éxito',
                });
            }))
            .catch((err) => {
                console.log(err);                
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al eliminar rol',
                    text: 'Hubo un problema al eliminar el rol. Por favor, inténtalo de nuevo.',
                });
            });
    }

    const getOneRol = (id) => {
        const urlGetOne = `${apiUrl}/roles/${id}`;
        axios.get(urlGetOne, getConfigAuth())
            .then((res) => {
                setIsRolApi(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const updateRol = (data, id) => {
        const urlUpdate = `${apiUrl}/roles/${id}`;
        axios.put(urlUpdate, data, getConfigAuth())
            .then((res) => {
                setIsRolApi(res.data)
                MySwal.fire({
                    icon: 'success',
                    title: 'Rol actualizado con éxito',
                });
            })
            .catch((err) => {
                console.log(err);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al actualizar rol',
                    text: 'Probablemete ya existe ese rol',
                });
            });
    }


    return { isRolApi, getRol, createRol, deleteRol, getOneRol, updateRol}
}

export default getApiRol;
