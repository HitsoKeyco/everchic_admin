import React, { useEffect, useState } from "react"
import './css/EditProduct.css'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

import dataInit from "../../../hooks/data/dataInit";
import editProductApi from "../../../hooks/products/updateProductApi";
import { addProductThunk, getAllProductThunk, updateProductThunk } from "../../../store/slices/products.slice";


const EditProduct = ({ product, setIsModalEditProduct }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [tags, setTags] = useState(product.tags);
    const [tagsIdDelete, setTagsIdDelete] = useState([])

    const [imageFiles, setImageFiles] = useState(product.productImgs);
    const [selectedImages, setSelectedImage] = useState(imageFiles[0] || null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageIdsToDelete, setImageIdsToDelete] = useState([])


    // estado para almacenar los id de las imagenes agregadas a <img>    
    const [imgFetchApi, setImgFetchApi] = useState([]);
    const [imgtoToLoad, setImgToLoad] = useState([]);

    /* Estados Globales Redux*/
    const sizes = useSelector(state => state.products.sizesStore)
    const collections = useSelector(state => state.products.collectionsStore)
    const categories = useSelector(state => state.products.categoryProductStore)
    const suppliers = useSelector(state => state.products.suppliersStore)

    /* hooks */
    const dispatch = useDispatch()

    useEffect(() => {
        // Esta función se ejecuta cuando imageFile cambia
        // Verificar si la imagen seleccionada todavía existe en imageFile
        if (selectedImages && !imageFiles.includes(selectedImages)) {
            // La imagen seleccionada se ha eliminado, establecer una nueva imagen principal
            if (imageFiles.length > 0) {
                setSelectedImage(imageFiles[0]);
            } else {
                setSelectedImage(null); // No hay imágenes en imageFile
            }
        }
    }, [imageFiles, selectedImages]);




    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            // Verificar que no haya más de 4 imágenes seleccionadas
            if (imageFiles.length + files.length > 4) {
                alert('Puedes seleccionar un máximo de 4 imágenes en total.');
                return;
            }

            const newImages = Array.from(files);
            setImageFiles([...imageFiles, ...newImages]);
            setImgToLoad([...imgtoToLoad, ...newImages]);
        }
    };

    const handleThumbnailClick = (index) => {
        if (index >= 0 && index < imageFiles.length) {
            setSelectedImage(imageFiles[index]);
            setSelectedImageIndex(index);
        } else {

        }
    };


    const handleRemoveImage = (index, ids) => {
        const updatedImages = [...imageFiles];

        if (ids) {
            // Imagen de la API
            setImageIdsToDelete([...imageIdsToDelete, ...ids]);
            setImgFetchApi((prevImages) => prevImages.filter((_, i) => i !== index));
            updatedImages.splice(index, 1);
            setImageFiles(updatedImages);
        } else {
            // Imagen local
            updatedImages.splice(index, 1);
            setImageFiles(updatedImages);

            if (index === selectedImageIndex) {
                const nextImageIndex = index === updatedImages.length ? index - 1 : index;
                setSelectedImage(updatedImages[nextImageIndex]);
                setSelectedImageIndex(nextImageIndex);
            }
        }
    };

    const handleTagsChange = newTags => {
        // Encuentra el tag eliminado comparando las listas de tags antiguos y nuevos
        const removedTag = tags.find(tag => !newTags.includes(tag.name));
        // Extrae el ID del tag eliminado
        const removedTagId = removedTag ? removedTag.id : null;
        // Actualiza el estado de los IDs a eliminar
        setTagsIdDelete(prevTagsIdDelete => [...prevTagsIdDelete, removedTagId].filter(id => id !== null));
        // Actualiza el estado solo con los tags restantes
        const updatedTags = tags.filter(tag => tag.id !== removedTagId);
        // Filtra los nuevos tags que ya existen en el estado actual
        const newTagsToAdd = newTags.filter(tag => !tags.some(t => t.name === tag));
        // Combina los tags actualizados con los nuevos tags añadidos (como objetos)
        const finalTags = [...updatedTags, ...newTagsToAdd.map(tagName => ({ name: tagName }))];
        // Actualiza el estado de los tags
        setTags(finalTags);
    };


    const submit = async (data) => {
        const productId = product.id
        dispatch(updateProductThunk(productId, data, imgtoToLoad, imageIdsToDelete, tags, tagsIdDelete))
        setIsModalEditProduct(false)
        setImageIdsToDelete([]);
        setTagsIdDelete([])
    };


    return (
        <>
            <div className="edit_product_container">
                <div className="edit_product_backdrop" onClick={() => setIsModalEditProduct(false)}></div>
                <form action="" className="edit_product_form" onSubmit={handleSubmit(submit)}>
                    <div className='edit_product_title_container'>
                        <p className='edit_product_title'>Agregar Producto</p>
                    </div>
                    {/*------------------------------\\ Image //-----------------------------------*/}
                    <div className="edit_product_image_container">
                        {selectedImages &&
                            <img
                                src={selectedImages.url || URL.createObjectURL(selectedImages)}
                                alt="Imagen seleccionada"
                                className="edit_product_image"
                            />
                        }
                    </div>

                    {/*------------------------------\\ Images Load  //-----------------------------------*/}

                    <div className='edit_product_images_load_container'>
                        {
                            imageFiles.length === 0 && <p className="edit_product_img_msj">¡Imagenes!</p>
                        }
                        {
                            imageFiles.map((image, index) => (
                                <div key={index} className="edit_product_images_img_container">
                                    <img
                                        src={image.url || URL.createObjectURL(image)}
                                        alt={`Miniatura ${index + 1}`}
                                        className={`edit_product_images ${selectedImages === image && "edit_product_images_border"}`}
                                        onClick={() => handleThumbnailClick(index)}
                                    />
                                    <div
                                        className=''
                                        onClick={() => handleRemoveImage(index, image.id ? [image.id] : null)}
                                    >
                                        <i className='bx bx-x edit_product_icon_delete_image'></i>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/*------------------------------\\ Input img //-----------------------------------*/}

                    {
                        imageFiles.length < 4 &&
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="edit_product_input_image"
                            multiple
                        />
                    }

                    {/*------------------------------\\ Tags //-----------------------------------*/}
                    <div className="edit_product_label_container">
                        <TagsInput
                            value={tags.map(tag => (typeof tag === 'object' ? tag.name : tag))}
                            onChange={handleTagsChange}
                        />
                    </div>

                    {/*------------------------------\\ SKU //-----------------------------------*/}
                    <div className="">
                        <div className=''>
                            <label className="edit_product_label" htmlFor="sku">
                                SKU:
                            </label>
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                defaultValue={product.sku}
                                className={`edit_product_input ${errors.sku ? 'input-error' : ''}`}
                                {...register('sku', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                        {/*------------------------------\\ Title //-----------------------------------*/}
                        <div className=''>
                            <label className="edit_product_label" htmlFor="title">
                                Nombre producto:
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                defaultValue={product.title}
                                className={`edit_product_input ${errors.title ? 'input-error' : ''}`}
                                {...register('title', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                        {/*------------------------------\\ Description //-----------------------------------*/}
                        <div className=''>
                            <label className="edit_product_label" htmlFor="description">
                                Descripcion:
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                defaultValue={product.description}
                                className={`edit_product_input ${errors.description ? 'input-error' : ''}`}
                                {...register('description', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                        <div className="edit_product_group_elements_container">
                            {/*------------------------------\\ Stock //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label className="edit_product_label" htmlFor="stock">
                                    Stock:
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    defaultValue={product.stock}
                                    className={`edit_product_input ${errors.stock ? 'input-error' : ''}`}
                                    {...register('stock', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            {/*------------------------------\\ Peso //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label className="edit_product_label" htmlFor="weight">
                                    Peso:
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    step="0.01"
                                    defaultValue={product.weight}
                                    className={`edit_product_input ${errors.weight ? 'input-error' : ''}`}
                                    {...register('weight', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            {/*------------------------------\\ Precio base costo //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label className="edit_product_label" htmlFor="cost_price">
                                    PP:
                                </label>
                                <input
                                    type="number"
                                    id="cost_price"
                                    name="cost_price"
                                    step="0.01"
                                    defaultValue={product.cost_price}
                                    className={`edit_product_input ${errors.cost_price ? 'input-error' : ''}`}
                                    {...register('cost_price', { required: 'Este campo es obligatorio' })}

                                />
                            </div>
                            {/*------------------------------\\ PVP //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label
                                    className="edit_product_label"
                                    htmlFor="sell_price"
                                    defaultValue='5.00'
                                >
                                    PVP:
                                </label>
                                <input
                                    name="sell_price"
                                    id="sell_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.sell_price}
                                    className={`edit_product_input ${errors.sell_price ? 'input-error' : ''}`}
                                    {...register('sell_price', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                        </div>

                        <div className="edit_product_group_elements_container">
                            {/*------------------------------\\ Size //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label htmlFor="sizeId" className='edit_product_label'>
                                    Talla:
                                </label>
                                <select
                                    name="sizeId"
                                    id="sizeId"
                                    defaultValue={product.sizeId}
                                    onChange={(e) => setValue('sizeId', e.target.value)}
                                    className={`edit_product_select ${errors.sizeId ? 'input-error' : ''}`}
                                    {...register('sizeId', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue >Seleccione uno</option>
                                    {sizes?.map((size) => (
                                        <option key={size.id} value={size.id}>
                                            {size.size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/*------------------------------\\ Collection //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label htmlFor="collectionId" className='edit_product_label'>
                                    Coleccion:
                                </label>
                                <select
                                    name="collectionId"
                                    id="collectionId"
                                    className={`edit_product_select ${errors.collectionId ? 'input-error' : ''}`}
                                    defaultValue={product.collectionId}
                                    onChange={(e) => setValue('collectionId', e.target.value)}
                                    {...register('collectionId', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue >Seleccione uno</option>
                                    {collections?.map((collection) => (
                                        <option key={collection.id} value={collection.id}>
                                            {collection.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="edit_product_group_elements_container">
                            {/*------------------------------\\ Category //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label htmlFor="category" className='edit_product_label'>
                                    Categoria:
                                </label>
                                <select
                                    name="categoryId"
                                    id="categoryId"
                                    className={`edit_product_select ${errors.categoryId ? 'input-error' : ''}`}
                                    defaultValue={product.categoryId}
                                    onChange={(e) => setValue('categoryId', e.target.value)}
                                    {...register('categoryId', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue >Seleccione uno</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/*------------------------------\\ Supplier //-----------------------------------*/}
                            <div className='edit_product_group_elements'>
                                <label htmlFor="supplierId" className='edit_product_label'>
                                    Proveedor:
                                </label>
                                <select
                                    name="supplierId"
                                    id="supplierId"
                                    className={`edit_product_select ${errors.supplierId ? 'input-error' : ''}`}
                                    defaultValue={product.supplierId}
                                    onChange={(e) => setValue('supplierId', e.target.value)}

                                    {...register('supplier', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue >Seleccione uno</option>
                                    {suppliers?.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.company}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="edit_product_button_container">
                            <button
                                className="edit_product_button_edit"
                                type="submit"
                            >
                                Agregar
                            </button>

                            <button
                                className="edit_product_button_cancel"
                                onClick={() => setIsModalEditProduct(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )

}

export default EditProduct