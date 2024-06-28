import axios from 'axios';
import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import './css/QrImage.css'
import Skeleton from '@mui/material/Skeleton';
import { Button } from '@mui/material';

const QrImage = () => {

    const apiUrlSocketIo = import.meta.env.VITE_API_URL_SOCKETIO;
    const apiUrlBackend = import.meta.env.VITE_API_URL;
    const [qrCode, setQRCode] = useState(false);
    const [statusSessionWhatsapp, setStatusSessionWhatsapp] = useState();

    let socket;

    useEffect(() => {
        socket = socketIOClient(apiUrlSocketIo);

        socket.on('qrCode', qrCodeData => {
            setQRCode(qrCodeData);
            console.log('Se ha recibido Qr');
        });

        socket.on('session_log', stateConectionLog => {
            console.log('session_log', stateConectionLog);
            if (stateConectionLog) {
                setStatusSessionWhatsapp(true);
            }
        });

        socket.on('session_logout', stateConectionLogOut => {
            console.log('session_logout', stateConectionLogOut);
            if (stateConectionLogOut) {
                setStatusSessionWhatsapp(false);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleGenerateQr = async () => {
        try {
            const res = await axios.get(`${apiUrlBackend}/admin/qr_code`);
            console.log(res.data);
        } catch (err) {
            console.log('Hubo un problema en la petición del Qr', err);
        }
    };

    const handleDisconetSession = () => {
        axios.post(`${apiUrlBackend}/admin/logout_session_whatsapp`)
            .then(res => {
                setStatusSessionWhatsapp(false)
                if (res.data.status === 200) {
                    console.log('session cerrada', res.data);
                }
            })
            .catch(error => {
                console.log('no se ha podido cerrar la sesión', error);
            });
    }

    useEffect(() => {
        axios.get(`${apiUrlBackend}/admin/client_whatsapp`)
            .then(res => {
                console.log(res.data);
                if (res.data === 'user logout') {
                    setStatusSessionWhatsapp(false)
                } else if (res.data === 'user Log') {
                    setStatusSessionWhatsapp(true)
                }
            })
            .catch(error => {
                console.log('no se ha podido obtener el cliente', error);
            });
    }, []);

    return (
        <div className='qr_image_container'>
            <h3 className='qr_image_title'>Whatsapp conexión {statusSessionWhatsapp ? 'conectado' : 'desconectado'}</h3>

            {
                statusSessionWhatsapp ? (
                    ''
                ) : (
                    qrCode ? (
                        <div className="qr_image_generate_container">
                            <img className='qr_image' src={qrCode} alt="QR Code" />
                        </div>
                    ) : (
                        <Skeleton
                            variant='rectangular'
                            width={275}
                            height={275}
                        />
                    )
                )
            }

            {statusSessionWhatsapp ? (
                <button onClick={handleDisconetSession}>Desconectar</button>
            ) : (
                <button onClick={handleGenerateQr}>Generar</button>
            )}
        </div>
    )
};

export default QrImage;
