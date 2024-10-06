import { Box, Button, Modal, TextField, Typography, Snackbar, Alert, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getConfigAuth from '../utils/getConfigAuth';
import { Edit, Delete, Calculate } from '@mui/icons-material';

const CollectionModal = () => {
    const url = `${import.meta.env.VITE_API_URL}/collections`;

    // Estado para controlar los modales y datos
    const [isModal, setIsModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [collectionName, setCollectionName] = useState("");
    const [collections, setCollections] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedCollection, setSelectedCollection] = useState(null);

    // Función para abrir/cerrar el modal de creación
    const openCloseModal = () => {
        setIsModal(!isModal);
    };

    // Función para abrir/cerrar el modal de edición
    const openCloseEditModal = () => {
        setIsEditModal(!isEditModal);
    };

    // Abrir el modal de edición con los datos de la colección seleccionada
    const openEditModal = (collection) => {
        setSelectedCollection(collection);
        setCollectionName(collection.name); // Prellenar el campo con el nombre actual
        openCloseEditModal();
    };

    // Función para manejar la creación de la colección
    const createCollection = async () => {
        if (!collectionName) {
            setSnackbarMessage('Por favor, ingrese el nombre de la colección');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.post(url, { name: collectionName }, getConfigAuth());
            setSnackbarMessage(`La colección "${collectionName}" ha sido creada exitosamente`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setCollectionName(''); // Limpiar el campo de texto
            fetchCollections(); // Actualizar la tabla
        } catch (error) {
            setSnackbarMessage('Hubo un problema al crear la colección. Inténtalo de nuevo.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error(error);
        }
    };

    // Función para editar la colección
    const editCollection = async () => {
        if (!collectionName || !selectedCollection) {
            setSnackbarMessage('Por favor, ingrese un nombre válido para la colección');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.put(`${url}/${selectedCollection.id}`, { name: collectionName }, getConfigAuth());
            setSnackbarMessage(`La colección "${collectionName}" ha sido actualizada exitosamente`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setCollectionName(''); // Limpiar el campo de texto
            fetchCollections(); // Actualizar la tabla
            openCloseEditModal(); // Cerrar modal de edición
        } catch (error) {
            setSnackbarMessage('Hubo un problema al actualizar la colección.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error(error);
        }
    };

    // Obtener colecciones desde la API
    const fetchCollections = async () => {
        try {
            const response = await axios.get(url, getConfigAuth());
            setCollections(response.data);
        } catch (error) {
            console.error('Error al obtener colecciones:', error);
        }
    };

    // Eliminar una colección
    const deleteCollection = async (id) => {
        try {
            await axios.delete(`${url}/${id}`, getConfigAuth());
            fetchCollections(); // Actualizar la tabla después de eliminar
            setSnackbarMessage('Colección eliminada exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error al eliminar colección:', error);
            setSnackbarMessage('Hubo un problema al eliminar la colección.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Cargar colecciones al montar el componente
    useEffect(() => {
        fetchCollections();
    }, []);

    // Función para cerrar el Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Button sx={{ width: '100%', maxWidth: '220px' }} onClick={openCloseModal} color="primary" variant="contained">
                Crear Colección
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
                        Crear Nueva Colección
                    </Typography>

                    <TextField
                        fullWidth
                        label="Nombre de la Colección"
                        variant="outlined"
                        onChange={(e) => setCollectionName(e.target.value)}
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
                                    <TableCell>Colección</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {collections.map((collection) => (
                                    <TableRow key={collection.id}>
                                        <TableCell sx={{ padding: '2px' }}>{collection.id}</TableCell>
                                        <TableCell sx={{ padding: '2px' }}>{collection.name}</TableCell>
                                        <TableCell  sx={{ display: 'flex', justifyContent:'center' , padding: '2px' }}>
                                            <IconButton color="primary" onClick={() => openEditModal(collection)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => deleteCollection(collection.id)}>
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
                        Editar Colección
                    </Typography>

                    <TextField
                        fullWidth
                        label="Nombre de la Colección"
                        variant="outlined"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
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

export default CollectionModal;
