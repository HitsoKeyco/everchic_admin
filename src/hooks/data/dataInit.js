import axios from "axios"
import getConfigAuth from "../../utils/getConfigAuth"
import { useDispatch } from "react-redux"
import { allCategoriesProducts, allCollections, allProducts, allSizes, allSuppliers, allTags } from "../../store/slices/products.slice"



const dataInit = () => {
    
    const url = import.meta.env.VITE_API_URL
    const dispatch = useDispatch()
    

    /*----------------- Products-----------------------*/
    const getAllProducts = () => {
        const path = '/products/'
        axios.get((url + path), getConfigAuth())
            .then(res => {
                dispatch(allProducts(res.data))
            })
            .catch(err => {
                console.log('getAllProducts', err);
            })
    }

    /*----------------- Categorias productos-----------------------*/
    const getAllCategoriesProducts = () => {
        const path = '/categories/'
        axios.get((url + path), getConfigAuth())
            .then(res => {
                dispatch(allCategoriesProducts(res.data))
            })
            .catch(err => {
                console.log('getAllCategoriesProducts', err);
            })
    }

    /*----------------- Tags -----------------------*/
    const getAllTags = () => {
        const path = '/tags/'
        axios.get((url + path), getConfigAuth())
            .then(res => {
                dispatch(allTags(res.data))
            })
            .catch(err => {
                console.log('getAllTags', err);
            })
    }

    /*----------------- Suppliers -----------------------*/
    const getAllSuppliers = () => {
        const path = '/suppliers/'
        axios.get((url + path), getConfigAuth())
            .then(res => {
                dispatch(allSuppliers(res.data))
            })
            .catch(err => {
                console.log('getAllSuppliers', err);
            })
    }

    /*----------------- Sizes -----------------------*/
    const getAllSizes = () => {
        const path = '/sizes/'
        axios.get((url + path), getConfigAuth())
            .then(res => {
                dispatch(allSizes(res.data))
            })
            .catch(err => {
                console.log('getAllSizes', err);
            })
    }

    /*----------------- Collections -----------------------*/
    const getAllCollections = () => {
        const path = '/collections/'
        axios.get((url + path), getConfigAuth())
            .then(res => {
                dispatch(allCollections(res.data))
            })
            .catch(err => {
                console.log('getAllCollections', err);
            })
    }


    return { getAllProducts, getAllCategoriesProducts, getAllTags, getAllSuppliers, getAllSizes, getAllCollections }

}

export default dataInit;