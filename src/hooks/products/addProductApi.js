import axios from "axios";
import getConfigAuth from "../../utils/getConfigAuth";

const addProductApi = async (data, tags, imageFiles) => {
    const url = import.meta.env.VITE_API_URL;

    try {
        // Enviar datos del producto
        const productData = {
            title: data.title,
            description: data.description,
            cost_price: data.cost_price,
            sell_price: data.sell_price,
            sku: data.sku,
            sizeId: data.size,
            stock: data.stock,
            categoryId: Number(data.category),
            supplierId: Number(data.supplier),
            collectionId: Number(data.collection),
        };
        const productResponse = await axios.post(`${url}/products`, productData, getConfigAuth());
        const productId = productResponse.data.id;

        // Enviar todas las imágenes simultáneamente
        const imageUploadPromises = imageFiles.map(async (imageFile) => {
            const formData = new FormData();
            formData.append('image', imageFile);
            const imageResponse = await axios.post(`${url}/product_images`, formData, getConfigAuth());
            return imageResponse.data.id;
        });
        const imageIds = await Promise.all(imageUploadPromises);

        // Asociar imágenes con el producto
        await axios.post(`${url}/products/${productId}/images`, imageIds, getConfigAuth());

        // Asociar talla con el producto
        const productSize = { productId, sizeId: Number(data.size) };
        await axios.post(`${url}/products/${productId}/addSize/${productSize.sizeId}`, productSize, getConfigAuth());

        // Relacionar etiquetas con el producto
        if (tags) {
            const urlTags = `${url}/tags/${productId}/relateTags`;
            await axios.post(urlTags, tags, getConfigAuth());
        }

        console.log('Producto agregado exitosamente.');
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
};

export default addProductApi;
