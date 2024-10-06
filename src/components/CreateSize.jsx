import { Box, Button, Modal, TextField, Typography, Snackbar, Alert, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getConfigAuth from '../utils/getConfigAuth';
import { Edit, Delete } from '@mui/icons-material';

const CreateSize = () => {
    const url = `${import.meta.env.VITE_API_URL}/sizes`;

    // Estado para controlar los modales y datos
    const [isModal, setIsModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [sizeName, setsizeName] = useState("");
    const [size, setSize] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedSize, setSelectedSize] = useState(null);

    // Función para abrir/cerrar el modal de creación
    const openCloseModal = () => {
        setIsModal(!isModal);
    };

    // Función para abrir/cerrar el modal de edición
    const openCloseEditModal = () => {
        setIsEditModal(!isEditModal);
    };

    // Abrir el modal de edición con los datos de la talla seleccionada
    const openEditModal = (size) => {
        setSelectedSize(size);
        setsizeName(size.size); // Prellenar el campo con el nombre actual
        openCloseEditModal();
    };

    // Función para manejar la creación de la talla
    const createCollection = async () => {
      console.log(sizeName);
      
        if (!sizeName) {
            setSnackbarMessage('Por favor, ingrese el nombre de la talla');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.post(url, { size: sizeName }, getConfigAuth());
            setSnackbarMessage(`La talla "${sizeName}" ha sido creada exitosamente`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setsizeName(''); // Limpiar el campo de texto
            fetchSize(); // Actualizar la tabla
        } catch (error) {
            setSnackbarMessage('Hubo un problema al crear la talla. Inténtalo de nuevo.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error(error);
        }
    };

    // Función para editar la talla
    const editCollection = async () => {
        if (!sizeName || !selectedSize) {
            setSnackbarMessage('Por favor, ingrese un nombre válido para la talla');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.put(`${url}/${selectedSize.id}`, { name: sizeName }, getConfigAuth());
            setSnackbarMessage(`La talla "${sizeName}" ha sido actualizada exitosamente`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setsizeName(''); // Limpiar el campo de texto
            fetchSize(); // Actualizar la tabla
            openCloseEditModal(); // Cerrar modal de edición
        } catch (error) {
            setSnackbarMessage('Hubo un problema al actualizar la talla.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error(error);
        }
    };

    // Obtener colecciones desde la API
    const fetchSize = async () => {
        try {
            const response = await axios.get(url, getConfigAuth());
            setSize(response.data);
        } catch (error) {
            console.error('Error al obtener colecciones:', error);
        }
    };

    // Eliminar una talla
    const deleteCollection = async (id) => {
        try {
            await axios.delete(`${url}/${id}`, getConfigAuth());
            fetchSize(); // Actualizar la tabla después de eliminar
            setSnackbarMessage('talla eliminada exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error al eliminar talla:', error);
            setSnackbarMessage('Hubo un problema al eliminar la talla.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Cargar colecciones al montar el componente
    useEffect(() => {
        fetchSize();
    }, []);

    // Función para cerrar el Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Button sx={{ width: '100%', maxWidth: '220px' }} onClick={openCloseModal} color="secondary" variant="contained">
                Crear Talla
            </Button>

            {/* Modal de creación */}
            <Modal
                open={isModal}
                onClose={openCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                    
                }}
            >
                <Box
                    sx={{                        
                        width: '90%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        height: 'max-content'

                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Crear Nueva Talla
                    </Typography>

                    <TextField
                        fullWidth
                        label="Nombre de la Talla"
                        variant="outlined"
                        onChange={(e) => setsizeName(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button sx={{ width: '100%', maxWidth: '220px' }} variant="contained" color="primary" onClick={createCollection}>
                            Guardar
                        </Button>
                        <Button sx={{ width: '100%', maxWidth: '220px' }} variant="outlined" color="secondary" onClick={openCloseModal}>
                            Cancelar
                        </Button>
                    </Box>

                    {/* Tabla de colecciones */}
                    <Box sx={{ maxHeight: 'calc(100vh - 400px)', minHeight: '150px', overflowY: 'auto', mt: 2 }}>
                        <Table stickyHeader sx={{ mt: 0 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Talla</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {size.map((size) => (
                                    <TableRow key={size.id}>
                                        <TableCell sx={{ padding: '2px' }}>{size.id}</TableCell>
                                        <TableCell sx={{ padding: '2px' }}>{size.size}</TableCell>
                                        <TableCell  sx={{ display: 'flex', justifyContent:'center' , padding: '2px' }}>
                                            <IconButton color="primary" onClick={() => openEditModal(size)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => deleteCollection(size.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </Modal>

            {/* Modal de edición */}
            <Modal
                open={isEditModal}
                onClose={openCloseEditModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    zIndex: 1500,
                    height: 'max-content'
                }}
            >
                <Box
                    sx={{
                        margin: '10px',
                        width: '90%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        
                    }}
                >
                    <Typography id="edit-modal-title" variant="h6" component="h2">
                        Editar Talla
                    </Typography>

                    <TextField
                        fullWidth
                        label="Nombre de la Talla"
                        variant="outlined"
                        value={sizeName}
                        onChange={(e) => setsizeName(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button sx={{ width: '100%', maxWidth: '220px' }} variant="contained" color="primary" onClick={editCollection}>
                            Guardar
                        </Button>
                        <Button sx={{ width: '100%', maxWidth: '220px' }} variant="outlined" color="secondary" onClick={openCloseEditModal}>
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateSize;
