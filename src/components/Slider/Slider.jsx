import React, { useEffect, useState } from "react";
import './css/Slider.css'
import { AnimatePresence, motion } from "framer-motion";

function Slider({ product }) {

    // ---- hooks ------
    const [currentSlide, setCurrentSlide] = useState(0);

    // ---- Evento next slider ------
    const nextSlide = () => {
        if (product) {
            setCurrentSlide((prevSlide) => (prevSlide === product.productImgs.length - 1 ? 0 : prevSlide + 1));
        }
    };

    // ---- Evento prev slider ------
    const prevSlide = () => {
        if (product) {
            setCurrentSlide((prevSlide) => (prevSlide === 0 ? product.productImgs.length - 1 : prevSlide - 1));
        }
    };


    return (
        <div className="slider-container">
            <i className='bx bx-chevron-left  slider_home_fade_button_prev left_action_modal' onClick={prevSlide}></i>
            <AnimatePresence>
                <div className="slide-wrapper">
                    {product?.productImgs.map((slide, index) => (
                        <motion.div
                            key={index}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <img
                                key={index}
                                className={`slide ${index === currentSlide ? 'active' : 'inactive'}`}
                                src={slide?.url}
                                alt={`Slide ${index}`}
                            />
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
            <i className='bx bx-chevron-right  slider_home_fade_button_next right_action_modal' onClick={nextSlide}></i>
        </div>
    );
}

export default Slider;
