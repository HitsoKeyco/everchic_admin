import { Box, Button, Modal, TextField, Typography, Snackbar, Alert, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getConfigAuth from '../utils/getConfigAuth';
import { Edit, Delete } from '@mui/icons-material';

const CreateSuppliers = () => {
    const url = `${import.meta.env.VITE_API_URL}/suppliers`;

    // Estado para controlar los modales y datos
    const [isModal, setIsModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [supplierData, setSupplierData] = useState({}); // Objeto para los datos del proveedor
    const [suppliers, setSuppliers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Función para abrir/cerrar el modal de creación
    const openCloseModal = () => {
        setIsModal(!isModal);
        setSupplierData({}); // Reiniciar datos al cerrar el modal
    };

    // Función para abrir/cerrar el modal de edición
    const openCloseEditModal = () => {
        setIsEditModal(!isEditModal);
    };

    // Abrir el modal de edición con los datos del proveedor seleccionado
    const openEditModal = (supplier) => {
        setSelectedSupplier(supplier);
        setSupplierData(supplier); // Prellenar el objeto con los datos actuales
        openCloseEditModal();
    };

    // Función para manejar la creación de un proveedor
    const createSupplier = async () => {
        if (!supplierData.company) {
            setSnackbarMessage('Por favor, ingrese el nombre del proveedor');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.post(url, supplierData, getConfigAuth());
            setSnackbarMessage(`El proveedor "${supplierData.company}" ha sido creado exitosamente`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            fetchSuppliers(); // Actualizar la tabla
            openCloseModal(); // Cerrar modal de creación
        } catch (error) {
            setSnackbarMessage('Hubo un problema al crear el proveedor. Inténtalo de nuevo.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error(error);
        }
    };

    // Función para editar el proveedor
    const editSupplier = async () => {
        if (!supplierData.company || !selectedSupplier) {
            setSnackbarMessage('Por favor, ingrese un nombre válido para el proveedor');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.put(`${url}/${selectedSupplier.id}`, supplierData, getConfigAuth());
            setSnackbarMessage(`El proveedor "${supplierData.company}" ha sido actualizado exitosamente`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            fetchSuppliers(); // Actualizar la tabla
            openCloseEditModal(); // Cerrar modal de edición
        } catch (error) {
            setSnackbarMessage('Hubo un problema al actualizar el proveedor.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error(error);
        }
    };

    // Obtener proveedores desde la API
    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(url, getConfigAuth());
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
        }
    };

    // Eliminar un proveedor
    const deleteSupplier = async (id) => {
        try {
            await axios.delete(`${url}/${id}`, getConfigAuth());
            fetchSuppliers(); // Actualizar la tabla después de eliminar
            setSnackbarMessage('Proveedor eliminado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
            setSnackbarMessage('Hubo un problema al eliminar el proveedor.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Cargar proveedores al montar el componente
    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Función para cerrar el Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Button sx={{ width: '100%', maxWidth: '220px' }} onClick={openCloseModal} color="secondary" variant="contained">
                Crear Proveedor
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
                        p: 2,
                        borderRadius: '8px',
                        height: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Crear Nuevo Proveedor
                    </Typography>

                    {/* Campos para ingresar datos del proveedor */}

                    <TextField
                        fullWidth
                        label="Nombre"
                        variant="outlined"
                        value={supplierData.firstName || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, firstName: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Apellidos"
                        variant="outlined"
                        value={supplierData.lastName || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, lastName: e.target.value })}
                        sx={{ mt: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Nombre de la empresa"
                        variant="outlined"
                        value={supplierData.company || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, company: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={supplierData.email || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Teléfono"
                        variant="outlined"
                        value={supplierData.phone || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, phone: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="RUC"
                        variant="outlined"
                        value={supplierData.ruc || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, ruc: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Dirección"
                        variant="outlined"
                        value={supplierData.address || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, address: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Ciudad"
                        variant="outlined"
                        value={supplierData.city || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, city: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="País"
                        variant="outlined"
                        value={supplierData.country || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, country: e.target.value })}
                        sx={{ mt: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button sx={{ width: '100%', maxWidth: '220px' }} variant="contained" color="primary" onClick={createSupplier}>
                            Guardar
                        </Button>
                        <Button sx={{ width: '100%', maxWidth: '220px' }} variant="outlined" color="secondary" onClick={openCloseModal}>
                            Cancelar
                        </Button>
                    </Box>

                    {/* Tabla de proveedores */}
                    <Box sx={{ maxHeight: 'calc(100vh - 400px)', minHeight: '150px', overflowY: 'auto', mt: 2 }}>
                        <Table stickyHeader sx={{ mt: 0 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Proveedor</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {suppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell sx={{ padding: '2px' }}>{supplier.id}</TableCell>
                                        <TableCell sx={{ padding: '2px' }}>{supplier.company}</TableCell>
                                        <TableCell sx={{ display: 'flex', justifyContent: 'center', padding: '2px' }}>
                                            <IconButton color="primary" onClick={() => openEditModal(supplier)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => deleteSupplier(supplier.id)}>
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
                    zIndex: 1500,
                    
                }}
            >
                <Box
                    sx={{
                        margin: '10px',
                        width: '90%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        borderRadius: '8px',
                        minHeight: 'max-content',
                        
                        overflowY: 'auto',
                    }}
                >
                    <Typography id="edit-modal-title" variant="h6" component="h2">
                        Editar Proveedor
                    </Typography>

                    {/* Campos para editar datos del proveedor */}
                    <TextField
                        fullWidth
                        label="Nombre del Proveedor"
                        variant="outlined"
                        value={supplierData.firstName || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, firstName: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={supplierData.lastName || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, lastName: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Nombre del Proveedor"
                        variant="outlined"
                        value={supplierData.company || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, company: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={supplierData.email || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Teléfono"
                        variant="outlined"
                        value={supplierData.phone || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, phone: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="RUC"
                        variant="outlined"
                        value={supplierData.ruc || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, ruc: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Dirección"
                        variant="outlined"
                        value={supplierData.address || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, address: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Ciudad"
                        variant="outlined"
                        value={supplierData.city || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, city: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="País"
                        variant="outlined"
                        value={supplierData.country || ''}
                        onChange={(e) => setSupplierData({ ...supplierData, country: e.target.value })}
                        sx={{ mt: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button sx={{ width: '100%', maxWidth: '220px' }} variant="contained" color="primary" onClick={editSupplier}>
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

export default CreateSuppliers;
