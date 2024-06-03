import  { useEffect, useState } from 'react'
import './css/Inventory.css'
import AddProducts from '../components/Modals/Product/AddProducts'
import dataInit from '../hooks/data/dataInit'
import CardProduct from '../components/Modals/Product/CardProduct'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductThunk } from '../store/slices/products.slice'


const InventoryPage = () => {

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
                    dispatch(getAllProductThunk()),                     
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
            {
                isModalProduct && <AddProducts setIsModalProduct={setIsModalProduct} />
            }


        </>
    )
}
export default InventoryPage