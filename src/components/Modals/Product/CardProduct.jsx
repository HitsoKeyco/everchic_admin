import { useState } from 'react';
import './css/CardProduct.css';
import Skeleton from 'react-loading-skeleton';
import { deleteProducts } from '../../../store/slices/products.slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CardProduct = ({ product, fetchProducts }) => {
    const [isModalproduct, setIsModalProduct] = useState(false);
    const [isModalEditproduct, setIsModalEditProduct] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleModal = () => {
        setIsModalProduct(true);
    };

    console.log(product);
    

    const handleDeleteproduct = (e) => {
        e.stopPropagation();
        Swal.fire({
            title: '¿Estas seguro de eliminar este producto?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteProducts(product.id));
                Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
                fetchProducts(); // Actualiza la lista de productos después de eliminar
            }
        });
    };

    const handleEditProducts = (e) => {
        e.stopPropagation();
        navigate(`/edit_product/${product.id}`);
    };

    return (
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
                            <li className='card_product_li card_product_low_stock'>Stock: {product.stock}</li>
                            :
                            <li className='card_product_li'>Stock: {product.stock}</li>
                    }
                    <li className='card_product_li'>Coleccion: {product.collection?.name}</li>
                    <li className='card_product_li'>Talla: {product.size?.size}</li>
                    <li className='card_product_li'>SKU: {product?.sku}</li>
                </ul>
            </div>
            <div className="card_product_actions">
                {product.deleted_at && <i className='bx bxs-hide card_product_button_hidden'></i>}
                <i className='bx bxs-edit card_product_button_edit' onClick={handleEditProducts}></i>
                <i className='bx bxs-trash card_product_button_delete' onClick={handleDeleteproduct}></i>
            </div>
        </div>
    );
};

export default CardProduct;
