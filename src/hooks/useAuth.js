import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserThunk } from "../store/slices/user.slice";
import Swal from "sweetalert2";

const useAuth = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const apiUrl = import.meta.env.VITE_API_URL

    const createUser = (data) => {
        const { email, firstName, lastName, password } = data
        const url = `${apiUrl}/users`
        axios.post(url, { email, firstName, lastName, password })
            .then(res => {
                if (res) {

                }
            })
            .catch(err => console.log(err))

    }

    const loginUser = (data) => {
        axios.post(`${apiUrl}/admin/login`, data)
            .then(res => {
                if (res.data) {
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem("user", JSON.stringify(res.data.admin))
                    dispatch(setUserThunk(res.data))
                    navigate('/');
                }
            })
            .catch(err => {
                if (err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Invalid credentials',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    }

    return { createUser, loginUser }
}

export default useAuth