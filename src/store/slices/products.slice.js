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
        collectionsStore: [] || ''
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
    console.log(data, tags, imageFiles);
    const configAuth = getConfigAuth(); // Definir config una vez
    try {
        // 1. Agregar el producto
        const productResponse = await axios.post(`${apiUrl}/products`, data, configAuth);
        const productId = productResponse.data.id;

        // 2. Subir imágenes y recopilar errores
        const imageUploadPromises = imageFiles.map(async (imageFile) => {
            try {
                const smallImage = await resizeAndConvertImage(imageFile, 500, 500);
                const mediumImage = await resizeAndConvertImage(imageFile, 1500, 1500);

                const formDataImage = new FormData();
                formDataImage.append('smallImage', smallImage, `${imageFile.name.split('.')[0]}-small.webp`);
                formDataImage.append('mediumImage', mediumImage, `${imageFile.name.split('.')[0]}-medium.webp`);
                formDataImage.append('productId', productId);

                await axios.post(`${apiUrl}/product_images`, formDataImage, {
                    ...configAuth,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                return { success: true, imageFile };
            } catch (uploadError) {
                console.error(`Error al subir la imagen ${imageFile.name}:`, uploadError);
                return { success: false, imageFile, error: uploadError };
            }
        });

        const imageResults = await Promise.allSettled(imageUploadPromises);

        // 3. Identificar imágenes fallidas
        const failedImages = imageResults
            .filter(result => result.status === 'fulfilled' && !result.value.success)
            .map(result => ({
                name: result.value.imageFile.name,
                error: result.value.error
            }));

        // También capturamos rechazos no manejados
        const rejectedPromises = imageResults
            .filter(result => result.status === 'rejected')
            .map(result => ({
                name: result.reason.imageFile.name,
                error: result.reason.error || result.reason
            }));

        const allFailedImages = [...failedImages, ...rejectedPromises];

        if (allFailedImages.length > 0) {
            // Opcional: Revertir la creación del producto si alguna imagen falla
            // await axios.delete(`${apiUrl}/products/${productId}`, configAuth);
            console.error('Algunas imágenes fallaron al subir:', allFailedImages);
            throw new Error(`Falló la subida de ${allFailedImages.length} imagen(es).`);
        }

        // 4. Asociar talla con el producto
        const productSize = { productId, sizeId: data.sizeId };
        await axios.post(`${apiUrl}/products/${productId}/addSize/${data.sizeId}`, productSize, configAuth);

        // 5. Relacionar etiquetas con el producto
        if (tags.length > 0) {
            const urlTags = `${apiUrl}/tags/${productId}/relateTags`;
            await axios.post(urlTags, tags, configAuth);
        }

        // 6. Despachar acción para obtener todos los productos
        dispatch(getAllProductThunk());
        return true;
    } catch (error) {
        console.error('Error al agregar el producto:', error.message || error);
        // Aquí puedes manejar el error de manera más específica, por ejemplo, notificar al usuario
        return false;
    }
};



// ------------------------- Update Product --------------------------------//
export const updateProductThunk = (productId, data, imgtoToLoad, imageIdsToDelete, tags, tagsIdDelete) => async (dispatch) => {
    console.log(data);
    
    const configAuth = getConfigAuth(); // Definir config una vez
    try {
        // 1. Actualizar datos del producto
        await axios.put(`${apiUrl}/products/${productId}`, data, configAuth);

        // 2. Subir imágenes
        const imageUploadPromises = imgtoToLoad.map(async (imageFile) => {
            try {
                const [smallImage, mediumImage] = await Promise.all([
                    resizeAndConvertImage(imageFile, 500, 500),
                    resizeAndConvertImage(imageFile, 1500, 1500),
                ]);

                const formDataImage = new FormData();
                formDataImage.append('smallImage', smallImage, `${imageFile.name.split('.')[0]}-small.webp`);
                formDataImage.append('mediumImage', mediumImage, `${imageFile.name.split('.')[0]}-medium.webp`);
                formDataImage.append('productId', productId);

                await axios.post(`${apiUrl}/product_images`, formDataImage, {
                    ...configAuth,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return { success: true, imageFile };
            } catch (uploadError) {
                console.error(`Error al subir la imagen ${imageFile.name}:`, uploadError);
                return { success: false, imageFile, error: uploadError };
            }
        });

        const imageResults = await Promise.allSettled(imageUploadPromises);

        // 3. Identificar imágenes fallidas
        const failedImages = imageResults
            .filter(result => result.status === 'fulfilled' && !result.value.success)
            .map(result => ({
                name: result.value.imageFile.name,
                error: result.value.error
            }));

        const rejectedPromises = imageResults
            .filter(result => result.status === 'rejected')
            .map(result => ({
                name: result.reason.imageFile.name,
                error: result.reason.error || result.reason
            }));

        const allFailedImages = [...failedImages, ...rejectedPromises];

        if (allFailedImages.length > 0) {
            console.error('Algunas imágenes fallaron al subir:', allFailedImages);
            throw new Error(`Falló la subida de ${allFailedImages.length} imagen(es).`);
        }

        // 4. Eliminar imágenes
        if (imageIdsToDelete.length) {
            try {
                await axios.delete(`${apiUrl}/product_images/remove`, {
                    data: { ids: imageIdsToDelete },
                    ...configAuth
                });
            } catch (deleteError) {
                console.error('Error al eliminar imágenes:', deleteError);
                throw deleteError; // Lanzar el error para capturarlo más adelante
            }
        }

        // 5. Relacionar etiquetas con el producto
        if (tags.length) {
            try {
                await axios.post(`${apiUrl}/tags/${productId}/relateTags`, tags, configAuth);
            } catch (tagError) {
                console.error('Error al asociar etiquetas:', tagError);
                throw tagError; // Lanzar el error para capturarlo más adelante
            }
        }

        // 6. Eliminar etiquetas
        if (tagsIdDelete.length) {
            try {
                await axios.delete(`${apiUrl}/tags/remove/${productId}`, {
                    data: { ids: tagsIdDelete },
                    ...configAuth
                });
            } catch (tagDeleteError) {
                console.error('Error al eliminar etiquetas:', tagDeleteError);
                throw tagDeleteError; // Lanzar el error para capturarlo más adelante
            }
        }

        // 7. Despachar acción para obtener todos los productos actualizados
        dispatch(getAllProductThunk());
        return true;  // Indica que la actualización fue exitosa
    } catch (error) {
        console.error('Hubo un problema al actualizar el producto:', error.message || error);
        return false;  // Indica que hubo un error durante la actualización
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


