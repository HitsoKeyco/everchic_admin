import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';


const QrImage = () => {
        
    const apiUrl = import.meta.env.VITE_API_URL_WHATSAPP;
    
    
    const [qrCode, setQRCode] = useState('');
    
    useEffect(() => {
        const socket = socketIOClient(apiUrl); // Cambia la URL por la de tu servidor
        socket.on('qrCode', qrCodeData => {
            setQRCode(qrCodeData);
        });

        return () => socket.disconnect();
    }, [qrCode]);

    return (
        <div>
            <h3 className='qr_image_title'>Qr emit SocketIo</h3>
            {qrCode && <img src={qrCode} alt="QR Code" />}            
        </div>
    );
};

export default QrImage;
