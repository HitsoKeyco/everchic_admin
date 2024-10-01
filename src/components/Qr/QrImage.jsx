import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './css/QrImage.css';
import Skeleton from '@mui/material/Skeleton';
import { Alert, AlertTitle, Button } from '@mui/material';
import io from 'socket.io-client';  // Importar socket.io-client



const QrImage = () => {    
    const PORT_BOT_WHATSAPP = import.meta.env.VITE_API_PORT_BOT_WHATSAPP;
    const PORT_SOCKET_IO = import.meta.env.VITE_API_PORT_SOCKET_IO;
    
    const [image, setImage] = useState(null);
    const [statusConnection, setStatusConnection] = useState(false);
    const [testMessageSuccess, setTestMessageSuccess] = useState(false);
    const [testMessageFail, setTestMessageFail] = useState(false);
    const [isSending, setIsSending] = useState(false); // Estado para controlar el envío

    useEffect(() => {
        const socket = io(PORT_SOCKET_IO, {
            reconnectionAttempts: 5,  // Número de intentos de reconexión
            reconnectionDelay: 5000 
        }); 

        socket.on('status_connection', (data) => {            
            if (data.connected) {
                setImage(null);
                setStatusConnection(true);
            } else {
                setStatusConnection(false);
                qrFetch();
            }
        });

        socket.on('connect_error', (error) => {
            console.log('Error de conexión:', error);
        });
    
        socket.on('reconnect_attempt', (attempt) => {
            console.log('Intento de reconexión:', attempt);
        });
    
        socket.on('reconnect_failed', () => {
            console.log('Falló la reconexión después de 5 intentos');
        });

        return () => {
            socket.disconnect(); // Desconectar el socket cuando el componente se desmonte
        };
    }, []);  // Ejecutar solo al montar el componente

    useEffect(() => {     
        if(!statusConnection){
            statusConnectionFetch();
        }
    }, [statusConnection]); // Añadido statusConnection para actualizar cuando cambia

    const qrFetch = async () => {
        try {
            const response = await axios.get(PORT_BOT_WHATSAPP, {
                responseType: 'arraybuffer'
            });

            if (response && response.data) {
                const byteArray = new Uint8Array(response.data);
                const base64String = btoa(String.fromCharCode(...byteArray));
                const imageBase64 = `data:image/png;base64,${base64String}`;
                setImage(imageBase64);
            } else {
                console.error('La respuesta no tiene datos');
                return { message: 'No hay imagen qr' };
            }

        } catch (error) {
            if (error.response) {
                console.error('Error en la respuesta del servidor:', error.response);
                return { message: 'El servidor respondió con un error', error };
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor:', error.request);
                return { message: 'No se recibió respuesta del servidor, verifica el puerto o la conexión', error };
            } else {
                console.error('Error en la configuración de la solicitud:', error.message);
                return { message: 'Error en la configuración de la solicitud', error };
            }
        }
    }

    const testMessageSend = async () => {
        setIsSending(true); // Iniciar envío
        try {
            const response = await axios.post(`${PORT_BOT_WHATSAPP}/v1/test-send-message`);
            if (response && response.data === 'sended') {
                setTestMessageSuccess(true);
                setTestMessageFail(false);
                // Ocultar la alerta después de 3 segundos
                setTimeout(() => setTestMessageSuccess(false), 3000);
            } else {
                setTestMessageFail(true);
                setTestMessageSuccess(false);
                setTimeout(() => setTestMessageFail(false), 3000);
            }

        } catch (error) {
            console.error('Error en la prueba:', error.message);
            setTestMessageFail(true);
            setTestMessageSuccess(false);
            setTimeout(() => setTestMessageFail(false), 3000);
        }
        setIsSending(false); // Finalizar envío
    }



    const statusConnectionFetch = async () => {
        try {
            const response = await axios.post(`${PORT_BOT_WHATSAPP}/v1/status`);            
            if (response && response.data === 'connected') {
                setStatusConnection(true);
            }
    
            if (response && response.data === 'disconnected') {
                setStatusConnection(false);
            }
    
        } catch (error) {
            console.error('Error en el estado de conexión:', error.message);
        }
    }


    return (
        <div className='qr_image_container'>
            <h3 className='qr_image_title'>WhatsApp Conexión</h3>
            <br></br>
            {
                statusConnection ? (
                    <>
                        {
                            image ? (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    className='qr_image_button' 
                                    onClick={qrFetch}
                                >
                                    Generar QR
                                </Button>
                            ) : (
                                <>
                                    <Alert severity="success">
                                        <AlertTitle>Conexión Establecida</AlertTitle>
                                        El bot está conectado a WhatsApp — <strong>¡Todo está funcionando!</strong>
                                    </Alert>
                                    <br></br>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        className='qr_image_button' 
                                        onClick={testMessageSend}
                                        disabled={isSending} // Deshabilitar mientras se envía
                                    >
                                        {isSending ? 'Enviando...' : 'Enviar Test'}
                                    </Button>
                                </>
                            )
                        }
                    </>
                ) : (
                    <>
                        {
                            image ? (
                                <>
                                    <img src={image} alt="qr" className='qr_image' />
                                    <br></br>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        className='qr_image_button' 
                                        onClick={qrFetch}
                                    >
                                        Actualizar QR
                                    </Button>
                                    <br></br>
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="rectangular" width={280} height={280} />
                                    <br></br>                                
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        className='qr_image_button' 
                                        onClick={qrFetch}
                                    >
                                        Generar QR
                                    </Button>
                                    <br></br>
                                </>
                            )
                        }

                        <Alert severity="warning" style={{ textAlign: 'center' }}>
                            <AlertTitle style={{ textAlign: 'left' }}>Sin conexión</AlertTitle>
                            <p style={{ textAlign: 'left' }}>El bot está desconectado a WhatsApp</p> 
                            <strong style={{ textAlign: 'center' }}>¡Escanea el Qr!</strong>
                        </Alert>
                    </>
                )
            }

            {/* Alertas para mensajes de prueba */}
            {
                testMessageSuccess &&
                <Alert severity="success" onClose={() => setTestMessageSuccess(false)}>
                    <AlertTitle>Mensaje enviado</AlertTitle>
                    El mensaje de prueba se ha enviado correctamente.
                </Alert>
            }

            {
                testMessageFail &&
                <Alert severity="error" onClose={() => setTestMessageFail(false)}>
                    <AlertTitle>Error al enviar el mensaje</AlertTitle>
                    Hubo un problema al enviar el mensaje de prueba. Por favor, inténtalo de nuevo.
                </Alert>
            }
        </div>
    );
};

export default QrImage;
