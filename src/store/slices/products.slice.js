import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getConfigAuth from "../../utils/getConfigAuth";

const products = createSlice({
    name: 'products',
    initialState: {
        productsStore: [],
        categoryProductStore: [],
        tagsStore: [],
        suppliersStore: [],
        sizesStore: [],
        collectionsStore: []
    },
    reducers: {
        allProducts: (state, action) => {
            state.productsStore = action.payload;
        },
        allCategoriesProducts: (state, action) => {
            state.categoryProductStore = action.payload;
        },
        allTags: (state, action) => {
            state.tagsStore = action.payload;
        },
        allSuppliers: (state, action) => {
            state.suppliersStore = action.payload;
        },
        allSizes: (state, action) => {
            state.sizesStore = action.payload;
        },
        allCollections: (state, action) => {
            state.collectionsStore = action.payload;
        }
    }
});

export const {
    allProducts,
    allCategoriesProducts,
    allTags,
    allSuppliers,
    allSizes,
    allCollections,
    updateProduct,
    addProduct,

} = products.actions;

export default products.reducer;


// ------------------------- Thunks --------------------------------//
const apiUrl = import.meta.env.VITE_API_URL;

// ------------------------- Thunks Get all products --------------------------------//
export const getAllProductThunk = () => (dispatch) => {
    axios.get(`${apiUrl}/products`, getConfigAuth())
        .then(res => {
            dispatch(allProducts(res.data))

        })
        .catch(err => {
            console.log('No se ha encontrado los productos', err);
        })
}


// ------------------------- Thunks  Add product --------------------------------//
export const addProductThunk = (data, tags, imageFiles) => async (dispatch) => {
    const dataProduct = {
        ...data,
        sizeId: parseInt(data.sizeId, 10),
        collectionId: parseInt(data.collectionId, 10),
        supplierId: parseInt(data.supplierId, 10),
        categoryId: parseInt(data.categoryId, 10)
    };

    try {

        // Agregar el producto
        const productResponse = await axios.post(`${apiUrl}/products`, dataProduct, getConfigAuth());
        const productId = productResponse.data.id;

        // Subir imágenes y obtener los IDs
        const imageUploadPromises = imageFiles.map(async (imageFile) => {
            const formData = new FormData();
            formData.append('image', imageFile);
            const imageResponse = await axios.post(`${apiUrl}/product_images`, formData, getConfigAuth());
            return imageResponse.data.id;
        });

        const imageIds = await Promise.all(imageUploadPromises);

        // Asociar imágenes con el producto
        await axios.post(`${apiUrl}/products/${productId}/images`, imageIds, getConfigAuth());

        // Asociar talla con el producto
        const productSize = { productId, sizeId: dataProduct.sizeId };
        await axios.post(`${apiUrl}/products/${productId}/addSize/${dataProduct.sizeId}`, productSize, getConfigAuth());

        // Relacionar etiquetas con el producto
        if (tags) {
            const urlTags = `${apiUrl}/tags/${productId}/relateTags`;
            await axios.post(urlTags, tags, getConfigAuth());
        }
        dispatch(getAllProductThunk())
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        // Maneja los errores aquí
    }
};



// ------------------------- Update Product --------------------------------//
export const updateProductThunk = (productId, data, imgtoToLoad, imageIdsToDelete, tags, tagsIdDelete) => async (dispatch) => {

    try {
        // Ingresamos actualizacion texto plano
        const res = await axios.put(`${apiUrl}/products/${productId}`, data, getConfigAuth())

        // Subir imágenes y obtener los IDs
        const imageUploadPromises = imgtoToLoad.map(async (imageFile) => {
            const formData = new FormData();
            formData.append('image', imageFile);
            const imageResponse = await axios.post(`${apiUrl}/product_images`, formData, getConfigAuth());
            return imageResponse.data.id;
        });

        const imageIds = await Promise.all(imageUploadPromises);

        // Asociar imágenes con el producto
        await axios.post(`${apiUrl}/products/${productId}/images`, imageIds, getConfigAuth());

        const idsImgDelete = { ids: imageIdsToDelete };
        if (imageIdsToDelete.length > 0) {
            axios.delete(`${apiUrl}/product_images/remove`, {
                data: idsImgDelete,  // Pasar los datos en la opción 'data'
                ...getConfigAuth()  // También incluye las opciones de configuración de autenticación si es necesario
            })
                .then(res => {
                    console.log(res.data);
                    dispatch(getAllProductThunk())
                })
                .catch(err => {
                    console.log(err);
                });
        }

        // Relacionar etiquetas con el producto
        if (tags) {
            const urlTags = `${apiUrl}/tags/${productId}/relateTags`;
            await axios.post(urlTags, tags, getConfigAuth());
        }

        //Eliminar tags         
        const idsTagsDelete = { ids: tagsIdDelete };
        if (tagsIdDelete.length > 0) {
            axios.delete(`${apiUrl}/tags/remove/${productId}`, {
                data: idsTagsDelete,  // Pasar los datos en la opción 'data'
                ...getConfigAuth()  // También incluye las opciones de configuración de autenticación si es necesario
            })
                .then(res => {
                    console.log(res.data);
                    dispatch(getAllProductThunk())
                })
                .catch(err => {
                    console.log(err);
                });
        }

        dispatch(getAllProductThunk())
    } catch (error) {
        console.log('Hubo un problema al actulizar el producto');
    }


}

// ------------------------- Delete Product --------------------------------//

export const deleteProducts = ( idProduct ) => ( dispatch ) =>  {
    if(idProduct){         
        axios.delete(`${apiUrl}/products/${idProduct}`, getConfigAuth())
        .then(res => {
            // console.log('producto eliminado exitosamente', res.data);
            dispatch(getAllProductThunk())
        })
        .catch(err => {
            console.log('existio un problema en la eliminacion del producto', err);
        })


    }else{  
        console.log('No existe el id del producto');
    }
}



