import { useEffect, useState } from 'react'
import './css/Inventory.css'
import dataInit from '../hooks/data/dataInit'
import CardProduct from '../components/Modals/Product/CardProduct'
import { useDispatch, useSelector } from 'react-redux'
import { allProducts } from '../store/slices/products.slice'
import axios from 'axios'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import getConfigAuth from '../utils/getConfigAuth'


const InventoryPage = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [isSearchProduct, setIsSearchProduct] = useState('')

    /* ----------------- Carga de funciones esenciales -----------------------*/    
    const dispatch = useDispatch()
    

    const [productsAPI, setProductsAPI] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 0
    });

    const limit = 5; //cantidad de productos

    useEffect(() => {
        axios.get(`${apiUrl}/products/admin?page=${pagination.currentPage}&limit=${limit}`, getConfigAuth())
            .then(res => {
                const { total, currentPage, totalPages, products } = res.data;
                setPagination({ total, currentPage, totalPages });
                setProductsAPI(products);
                localStorage.setItem('everchic_stored_products', JSON.stringify(res.data));
                dispatch(allProducts(products))

            })
            .catch(err => {
                console.log(err);
            });
    }, [pagination.currentPage]);



    const handleChangePage = (event, newPage) => {
        const newPageNumber = parseInt(newPage, 10);
        if (newPageNumber > 0 && newPageNumber <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPageNumber }));
        } else {
            console.log("No se puede ir a una página negativa o fuera de rango");
        }
    };
    const navigate = useNavigate()

    const handleAddProduct = () => {
        navigate('/add_product')
    }

    return (
        <>
            <div className="inventory_page_container">
                <div className="inventory_page_controllers_user_container">
                    <p className='inventory_page_title'>Inventario</p>
                    <div className="inventory_page_controller_user">
                        <div className="inventory_page_controllers_search_container">
                            <input
                                type="text"
                                className='inventory_page_search_input'
                                placeholder='Ingrese nombre del producto.'
                                onChange={(e) => setIsSearchProduct(e.target.value)}
                            />
                            <i className='bx bx-search-alt inventory_page_search_button' ></i>
                        </div>
                        <div className="inventory_page_controllers_add_contact_container">
                            <i className='bx bx-add-to-queue inventory_page_add' onClick={handleAddProduct}></i>
                        </div>
                    </div>
                </div>
                {
                    productsAPI?.map(product => (
                        <div
                            className="inventory_page_product_container"
                            key={product.id}
                        >
                            <CardProduct product={product} />
                        </div>
                    ))
                }

            </div>
            <div className='inventory_page_control_pagination_container'>
                <Stack spacing={2}>
                    <Pagination
                        count={pagination.totalPages}
                        page={parseInt(pagination.currentPage)}
                        onChange={handleChangePage}
                        variant="outlined"
                        shape="rounded"
                    />
                </Stack>
            </div>
        </>
    )
}
export default InventoryPage