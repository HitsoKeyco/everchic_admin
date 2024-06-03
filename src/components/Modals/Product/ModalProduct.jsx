import React from 'react'
import './css/ModalProduct.css'
import Slider from '../../Slider/Slider';
const ModalProduct = ({ product, setIsModalProduct }) => {
    
    return (
        <>
            <div className="modal_product_container">
                <div className="modal_product_backdrop" onClick={() => setIsModalProduct(false)}></div>
                <div className="modal_product_info_container">
                    <h3 className='modal_product_title'>{product.title}</h3>
                    {
                        <Slider product={product} />
                    }
                    <ul className='modal_product_ul'>
                        <li className='modal_product_li modal_product_li_description'>{product.description}</li>
                        <li className='modal_product_li'>SKU: {product.sku}</li>
                        <li className={`modal_product_li ${product.stock < 6 && 'modal_product_low_stock'}`}>Stock: {product.stock}</li>
                        <li className='modal_product_li'>Categoria: {product.category.name}</li>
                        <li className='modal_product_li'>Coleccion: {product.collection.name}</li>
                        <li className='modal_product_li'>Talla: {product.size.size}</li>
                        <li className='modal_product_li'>PP: ${product.cost_price}</li>
                        <li className='modal_product_li'>PVP: ${product.sell_price}</li>
                        <div className="modal_product_tags_container">
                            {
                                product.tags?.map(tag => (
                                    <li key={tag.id} className='modal_product_li_tag'>{tag.name}</li>
                                ))
                            }
                        </div>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ModalProduct