import { useState } from "react"
import getConfigAuth from "../../utils/getConfigAuth";
import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const getApiExpenses = () => {
    const MySwal = withReactContent(Swal)
    const [expensesAPI, setExpensesAPI] = useState()
    const [expensesCategoryAPI, setCategoryExpensesAPI] = useState()
    const [bankAPI, setBankAPI] = useState()
    
    const apiUrl = import.meta.env.VITE_API_URL

    const getExpenses = () => {
        const url = `${apiUrl}/expenses`
        axios.get(url, getConfigAuth())
            .then(res => {
                setExpensesAPI(res.data)
            })
            .catch(err => {
                console.log(err);
            });
    }

    const getCategoryExpenses = () => {
        const url = `${apiUrl}/categories_expenses`
        axios.get(url, getConfigAuth())
            .then(res => {
                setCategoryExpensesAPI(res.data)
            })
            .catch(err => {
                console.log(err);
            });
    }

    const getBank = () => {
        const url = `${apiUrl}/bank`
        axios.get(url, getConfigAuth())
            .then(res => {
                setBankAPI(res.data)
            })
            .catch(err => {
                console.log(err);
            });
    }

    const createExpenses = (data) => {
        const url = `${apiUrl}/expenses`
        axios.post(url, data, getConfigAuth())
            .then(res => {                
                MySwal.fire({
                    icon: 'success',
                    title: 'Compra creada con éxito',
                });
            })
            .catch(err => {
                console.log(err);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error, fijate si los campos estan llenos',                    
                });
            });
    }

    return { expensesAPI, getExpenses, createExpenses, expensesCategoryAPI, getCategoryExpenses, bankAPI, getBank }
}
export default getApiExpenses