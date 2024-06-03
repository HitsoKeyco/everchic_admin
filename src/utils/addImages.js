import axios from "axios";
import getConfigAuth from "./getConfigAuth";


export const createProductImagesTagsSize = async (imageFiles, productId, data, tags) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const arrayImg = []
    for (const imageFile of imageFiles) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await axios.post(`${apiUrl}/product_images`, formData, getConfigAuth());
        arrayImg.push(res.data.id)
    }

    

    if (arrayImg) {
        await axios.post(`${apiUrl}/products/${productId}/images`, arrayImg, getConfigAuth());
    }

    const productSize = {
        productId,
        sizeId: Number(data.size),
    }
    await axios.post(`${apiUrl}/products/${productId}/addSize/${productSize.sizeId}`, productSize, getConfigAuth());

    

    if (tags) {
        const urlTags = `${apiUrl}/tags/${productId}/relateTags`;

        axios.post(urlTags, tags, getConfigAuth())
        .then(res =>  {
            console.log(res.data);
        })
        .catch(err => console.log(err))
    }

};

/*------------------------------Actualizar------------------------------------*/

export const updateProductImagesTagsSize = async (imageFiles, productId, data, tags) => {

    const arrayImg = []

    for (const imageFile of imageFiles) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await axios.post(`${apiUrl}/product_images`, formData, getConfigAuth())
        arrayImg.push(res.data.id)
    }

    

    if (arrayImg) {
        await axios.post(`${apiUrl}/products/${productId}/images`, arrayImg, getConfigAuth());
    }

    const productSize = {
        productId,
        sizeId: Number(data.size),
    }
    await axios.post(`${apiUrl}/products/${productId}/addSize/${productSize.sizeId}`, productSize, getConfigAuth());

    if (tags) {
        for (const tagName of tags) {
            const tagData = {
                name: tagName,
            };
            const postTag = await axios.post('${apiUrl}/tags', tagData, getConfigAuth());
            


            if (postTag) {

                const dataProductTag = {
                    productId,
                    tagId: Number(postTag.id)
                }
                const res =  await axios.post(`${apiUrl}/products/${productId}/addTag/${postTag.data.id}`, dataProductTag, getConfigAuth());
                
                if (res){
                    setUpdate(true)
                }
            }
        }
    }

};

