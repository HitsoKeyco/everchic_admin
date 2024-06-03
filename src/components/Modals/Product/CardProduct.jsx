import { useState } from 'react';
import ModalProduct from './ModalProduct';
import './css/CardProduct.css'
import EditProduct from './EditProduct';
import Skeleton from 'react-loading-skeleton';
import { deleteProducts } from '../../../store/slices/products.slice';
import { useDispatch } from "react-redux";

const CardProduct = ({ product }) => {
    // ---- Hooks -----
    const [isModalproduct, setIsModalProduct] = useState(false);
    const [isModalEditproduct, setIsModalEditProduct] = useState(false);

    const dispatch = useDispatch()

    // ---- Handle modal -----
    const handleModal = () => {
        setIsModalProduct(true)
    }
    

    const handleEditProduct = (e) => {
        e.stopPropagation();
        setIsModalEditProduct(true)
    }

    const handleDeleteproduct = (e) => {
        e.stopPropagation();        
        dispatch(deleteProducts(product.id))
    }



    return (
        <>
            <div className="card_product_container" onClick={handleModal}>
                <div className="card_product_img_container">
                    {product.productImgs && product.productImgs.length > 0 ? (
                        <img className='card_product_img' src={product.productImgs[0].url} alt="" />
                    ) : (

                        <Skeleton                            
                            variant="rectangular"
                            width={115}
                            height="100%"
                        />
                    )}
                </div>
                <div className="card_product_info_container">
                    <ul>
                        <li className='card_product_li card_product_li_title'>{product?.title}</li>
                        <li className='card_product_li'>Categoria: {product.category?.name}</li>
                        <li className='card_product_li'>Stock: {product?.stock}</li>
                        <li className='card_product_li'>Coleccion: {product.collection?.name}</li>
                        <li className='card_product_li'>Talla: {product.size?.size}</li>
                        {
                            product.stock < 6 && <li className='card_product_li card_product_li_stock card_product_low_stock'>Stock: {product.stock}</li>
                        }
                    </ul>

                </div>
                <div className="card_product_actions">
                    <i className='bx bxs-edit card_product_button_edit' onClick={handleEditProduct}></i>
                    <i className='bx bxs-trash card_product_button_delete' onClick={handleDeleteproduct}></i>
                </div>

            </div>
            {
                isModalproduct && <ModalProduct product={product} setIsModalProduct={setIsModalProduct} />
            }
            {
                isModalEditproduct && <EditProduct product={product} setIsModalEditProduct={setIsModalEditProduct} />
            }
        </>
    )
}
export default CardProduct



