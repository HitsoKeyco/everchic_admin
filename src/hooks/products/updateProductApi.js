import axios from "axios";
import getConfigAuth from "../../utils/getConfigAuth";
import { useDispatch } from "react-redux";



const updateProductApi = async (data, productId,  tags, imageFiles, imgtoToLoad, imageIdsToDelete, tagsIdDelete) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch()
    try {
        //---- Actualizacion de informacion plana del producto ----- //        
        if (productId) {
            axios.put(`${apiUrl}/products/${productId}`, data, getConfigAuth())
            .then(res => {
                if(res){
                    dispatch()
                }
            })
            .catch(err => {
                console.log(err);
            })
        }

    } catch (error) {
        console.error('Error al editar el producto:', error);
    }
};

export default updateProductApi;
