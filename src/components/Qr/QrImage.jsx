import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './css/QrImage.css';
import Skeleton from '@mui/material/Skeleton';


const QrImage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [imageUrl, setImageUrl] = useState('');
    
    useEffect(() => {
        axios.get(`${apiUrl}/whatsapp/qr`)
            .then(res => {
                const imageString = res.data;
                setImageUrl(imageString);
            })
            .catch(err => console.log(err));
    }, [apiUrl]);

    return (
        <div className='qr_image_container'>
            <h3 className='qr_image_title'>WhatsApp Conexión</h3>
            {
                imageUrl ? (
                    <div className="qr_image_generate_container">
                        <img
                            className='qr_image'
                            src={imageUrl}
                            alt="QR Code"
                        />
                    </div>
                ) : (
                    <Skeleton
                        variant='rectangular'
                        width={275}
                        height={275}
                    />
                )
            }
        </div>
    );
};

export default QrImage;
