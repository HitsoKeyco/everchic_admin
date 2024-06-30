import { useState } from 'react';
import './css/CardProduct.css'
import Skeleton from 'react-loading-skeleton';
import { deleteProducts } from '../../../store/slices/products.slice';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const CardProduct = ({ product }) => {
    // ---- Hooks -----
    const [isModalproduct, setIsModalProduct] = useState(false);
    const [isModalEditproduct, setIsModalEditProduct] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ---- Handle modal -----
    const handleModal = () => {
        setIsModalProduct(true)
    }

    const handleDeleteproduct = (e) => {
        e.stopPropagation();
        dispatch(deleteProducts(product.id))
    }

    const handleEditProducts = (e) => {
        e.stopPropagation();
        navigate(`/edit_product/${product.id}`)
    }


    return (
        <>
            <div className="card_product_container" onClick={handleModal}>
                <div className="card_product_img_container">
                    {product.productImgs && product.productImgs.length > 0 ? (
                        <img className='card_product_img' src={product.productImgs[0].url_small} alt="" />
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
                        {
                            product.stock < 6 ?
                                <li className='card_product_li  card_product_low_stock'>Stock: {product.stock}</li>
                                :
                                <li className='card_product_li'>Stock: {product.stock}</li>
                        }
                        <li className='card_product_li'>Coleccion: {product.collection?.name}</li>
                        <li className='card_product_li'>Talla: {product.size?.size}</li>
                    </ul>
                </div>
                <div className="card_product_actions">
                    {
                        product.deleted_at && <i class='bx bxs-hide card_product_button_hidden'></i>
                    }
                    <i className='bx bxs-edit card_product_button_edit' onClick={handleEditProducts}></i>
                    <i className='bx bxs-trash card_product_button_delete' onClick={handleDeleteproduct}></i>
                </div>
            </div>
        </>
    )
}
export default CardProduct



