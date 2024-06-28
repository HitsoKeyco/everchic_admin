import { useEffect, useState } from 'react'
import './css/Inventory.css'
import AddProducts from '../components/Modals/Product/AddProducts'
import dataInit from '../hooks/data/dataInit'
import CardProduct from '../components/Modals/Product/CardProduct'
import { useDispatch, useSelector } from 'react-redux'
import { allProducts } from '../store/slices/products.slice'
import axios from 'axios'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const InventoryPage = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [isModalProduct, setIsModalProduct] = useState(false)
    const [isSearchProduct, setIsSearchProduct] = useState('')

    /* ----------------- Carga de funciones esenciales -----------------------*/
    const { getAllProducts, getAllCategoriesProducts, getAllTags, getAllSuppliers, getAllSizes, getAllCollections } = dataInit()
    const dispatch = useDispatch()
    const products = useSelector(state => state.products.productsStore)

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getAllCategoriesProducts(),
                    getAllTags(),
                    getAllSuppliers(),
                    getAllSizes(),
                    getAllCollections(),
                ]);
            } catch (err) {
                console.log('No se cargado los datos iniciales');
            }
        }
        fetchData();
    }, [])

    const [productsAPI, setProductsAPI] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 0
    });

    const limit = 10; //cantidad de productos

    

    useEffect(() => {
        axios.get(`${apiUrl}/products?page=${pagination.currentPage}&limit=${limit}`)
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
    const handleAddProduct = () => {
        setIsModalProduct(true)
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
                    products?.map(product => (
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
                        count={pagination.totalPages - 1}
                        page={parseInt(pagination.currentPage)}
                        onChange={handleChangePage}
                        variant="outlined"
                        shape="rounded"
                    />
                </Stack>
            </div>
            {
                isModalProduct && <AddProducts setIsModalProduct={setIsModalProduct} />
            }


        </>
    )
}
export default InventoryPage