import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getConfigAuth from "../../utils/getConfigAuth";
import Resizer from 'react-image-file-resizer';

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

//------------------------- Thunks Get all products --------------------------------//
export const getAllProductThunk = () => (dispatch) => {
    axios.get(`${apiUrl}/products`, getConfigAuth())
        .then(res => {
            dispatch(allProducts(res.data))
        })
        .catch(err => {
            console.log('No se ha encontrado los productos', err);
        })
}

//------------------------- Thunks Get All categories --------------------------------//

export const allCategoriesProductsThunk = () => (dispatch) => {
    axios.get(`${apiUrl}/categories`, getConfigAuth())
        .then(res => {
            dispatch(allCategoriesProducts(res.data))
        })
        .catch(err => {
            console.log('error en la consulta de categorias', err);
        })

}

//------------------------- Thunks Get All Sizes --------------------------------//

export const allSizesProductsThunk = () => (dispatch) => {
    axios.get(`${apiUrl}/sizes`, getConfigAuth())
        .then(res => {
            dispatch(allSizes(res.data))
        })
        .catch(err => {
            console.log('error en la consulta de sizes', err);
        })

}

//------------------------- Thunks Get All Sizes --------------------------------//

export const allCollectionProductsThunk = () => (dispatch) => {
    axios.get(`${apiUrl}/collections`, getConfigAuth())
        .then(res => {
            dispatch(allCollections(res.data))
        })
        .catch(err => {
            console.log('error en la consulta de sizes', err);
        })

}
//------------------------- Thunks Get All Sizes --------------------------------//

export const allSupplierProductsThunk = () => (dispatch) => {
    axios.get(`${apiUrl}/suppliers`, getConfigAuth())
        .then(res => {
            dispatch(allSuppliers(res.data))
        })
        .catch(err => {
            console.log('error en la consulta de sizes', err);
        })

}



//------------------------- Thunks  Add product --------------------------------//

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

        // Subir imágenes y obtener los IDs y URLs
        const imageUploadPromises = imageFiles.map(async (imageFile) => {
            const smallImage = await resizeAndConvertImage(imageFile, 500, 500);
            const mediumImage = await resizeAndConvertImage(imageFile, 1500, 1500);

            // Subir la imagen pequeña y la imagen mediana
            const formDataImage = new FormData();
            formDataImage.append('smallImage', smallImage, `${imageFile.name.split('.')[0]}-small.webp`);
            formDataImage.append('mediumImage', mediumImage, `${imageFile.name.split('.')[0]}-medium.webp`);
            formDataImage.append('productId', productId);

            // Subir el FormData con ambas imágenes
            const imageResponse = await axios.post(`${apiUrl}/product_images`, formDataImage, {
                ...getConfigAuth(),
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return imageResponse.data;
        });

        const imageInfos = await Promise.all(imageUploadPromises);

        // // Asociar imágenes con el producto
        // await axios.post(`${apiUrl}/products/${productId}/images`, imageInfos.map(info => info.id), getConfigAuth());

        // Asociar talla con el producto
        const productSize = { productId, sizeId: dataProduct.sizeId };
        await axios.post(`${apiUrl}/products/${productId}/addSize/${dataProduct.sizeId}`, productSize, getConfigAuth());

        // Relacionar etiquetas con el producto
        if (tags) {
            const urlTags = `${apiUrl}/tags/${productId}/relateTags`;
            await axios.post(urlTags, tags, getConfigAuth());
        }

        // Despachar acción para obtener todos los productos
        dispatch(getAllProductThunk());
        return true;
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        // Maneja los errores aquí
    }
};


// ------------------------- Update Product --------------------------------//
export const updateProductThunk = (productId, data, imgtoToLoad, imageIdsToDelete, tags, tagsIdDelete) => async (dispatch) => {
    try {
        // Actualizar datos del producto
        await axios.put(`${apiUrl}/products/${productId}`, data, getConfigAuth());

        // Subir imágenes y obtener los IDs
        const imageUploadPromises = imgtoToLoad.map(async (imageFile) => {
            const smallImage = await resizeAndConvertImage(imageFile, 500, 500);
            const mediumImage = await resizeAndConvertImage(imageFile, 1500, 1500);

            // Crear FormData con ambas imágenes
            const formDataImage = new FormData();
            formDataImage.append('smallImage', smallImage, `${imageFile.name.split('.')[0]}-small.webp`);
            formDataImage.append('mediumImage', mediumImage, `${imageFile.name.split('.')[0]}-medium.webp`);
            formDataImage.append('productId', productId);

            // Subir el FormData con ambas imágenes
            const imageResponse = await axios.post(`${apiUrl}/product_images`, formDataImage, {
                ...getConfigAuth(),
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return imageResponse.data;
        });

        await Promise.all(imageUploadPromises);

        // Eliminar imágenes
        if (imageIdsToDelete.length > 0) {
            const idsImgDelete = { ids: imageIdsToDelete };
            await axios.delete(`${apiUrl}/product_images/remove`, {
                data: idsImgDelete,  // Pasar los datos en la opción 'data'
                ...getConfigAuth()  // También incluye las opciones de configuración de autenticación si es necesario
            });
        }

        // Relacionar etiquetas con el producto
        if (tags) {
            const urlTags = `${apiUrl}/tags/${productId}/relateTags`;
            await axios.post(urlTags, tags, getConfigAuth());
        }

        // Eliminar etiquetas
        if (tagsIdDelete.length > 0) {
            const idsTagsDelete = { ids: tagsIdDelete };
            await axios.delete(`${apiUrl}/tags/remove/${productId}`, {
                data: idsTagsDelete,  // Pasar los datos en la opción 'data'
                ...getConfigAuth()  // También incluye las opciones de configuración de autenticación si es necesario
            });
        }

        // Despachar acción para obtener todos los productos
        dispatch(getAllProductThunk());
        return true;
    } catch (error) {
        console.error('Hubo un problema al actualizar el producto:', error);
        // Manejar los errores aquí
    }
};


// ------------------------- Delete Product --------------------------------//

export const deleteProducts = (idProduct) => (dispatch) => {
    if (idProduct) {
        axios.delete(`${apiUrl}/products/${idProduct}`, getConfigAuth())
            .then(res => {
                // console.log('producto eliminado exitosamente', res.data);
                dispatch(getAllProductThunk())
            })
            .catch(err => {
                console.log('existio un problema en la eliminacion del producto', err);
            })


    } else {
        console.log('No existe el id del producto');
    }
}


//-------------------- Resize de Img to webP -------------------
async function resizeAndConvertImage(imageFile, width, height) {
    return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
            imageFile,
            width,
            height,
            'WEBP',
            80,
            0,
            (uri) => {
                // Convertir el URI a Blob
                fetch(uri)
                    .then(res => res.blob())
                    .then(blob => resolve(blob))
                    .catch(error => reject(error));
            },
            'base64' // Formato de salida
        );
    });
}


