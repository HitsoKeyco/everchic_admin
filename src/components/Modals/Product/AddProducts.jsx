import React, { useEffect, useState } from "react"
import './css/AddProducts.css'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { addProductThunk } from "../../../store/slices/products.slice";

const AddProducts = ({ setIsModalProduct }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [tags, setTags] = useState([]);
    const [selectedImages, setSelectedImage] = useState(null);
    const [imageFiles, setImageFile] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
            // Sergio esto es una sintaxis de propagacion
            setImageFile([...imageFiles, ...newImages]);

            // mostrar la primera imagen por defectop
            if (!selectedImages) {
                setSelectedImage(newImages[0]);
            }
        }
    };

    const handleThumbnailClick = (index) => {
        if (index >= 0 && index < imageFiles.length) {
            setSelectedImage(imageFiles[index]);
            setSelectedImageIndex(index);
        } else {

        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...imageFiles];
        updatedImages.splice(index, 1);
        setImageFile(updatedImages);

        // Verificar si la imagen eliminada era la imagen seleccionada
        if (index === selectedImageIndex) {
            // Si la imagen eliminada era la última imagen, seleccionar la anterior
            // Si era una imagen en medio, seleccionar la siguiente
            const nextImageIndex = index === updatedImages.length ? index - 1 : index;
            setSelectedImage(updatedImages[nextImageIndex]);
            setSelectedImageIndex(nextImageIndex);
            setImageFile(updatedImages);
        }
    };

    const handleTagsChange = async (tag) => {
        setTags(tag)
    };


    const submit = async (data) => {
        dispatch(addProductThunk(data, tags, imageFiles))
        setIsModalProduct(false);
    };


    return (
        <>
            <div className="add_product_container">
                <div className="add_product_backdrop" onClick={() => setIsModalProduct(false)}></div>
                <form action="" className="add_product_form" onSubmit={handleSubmit(submit)}>
                    <div className='add_product_title_container'>
                        <p className='add_product_title'>Agregar Producto</p>
                    </div>
                    {/*------------------------------\\ Image //-----------------------------------*/}
                    <div className="add_product_image_container">
                        {selectedImages &&
                            <img
                                src={URL.createObjectURL(selectedImages)}
                                alt="Imagen seleccionada"
                                className="add_product_image"
                            />
                        }
                    </div>

                    {/*------------------------------\\ Images Load  //-----------------------------------*/}

                    <div className='add_product_images_load_container'>
                        {
                            imageFiles.length === 0 && <p className="add_product_img_msj">¡Imagenes!</p>
                        }
                        {
                            imageFiles.map((image, index) => (
                                <div key={index} className="add_product_images_img_container">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Miniatura ${index + 1}`}
                                        className={`add_product_images ${selectedImages === image && "add_product_images_border"}`}
                                        onClick={() => handleThumbnailClick(index)}
                                    />
                                    <div
                                        className=''
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <i className='bx bx-x add_product_icon_delete_image'></i>
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
                            className="add_product_input_image"
                            multiple
                        />
                    }

                    {/*------------------------------\\ Tags //-----------------------------------*/}
                    <div className="add_product_label_container">
                        <TagsInput
                            value={tags}
                            onChange={handleTagsChange}
                        />
                    </div>

                    {/*------------------------------\\ SKU //-----------------------------------*/}
                    <div className="">
                        <div className=''>
                            <label className="add_product_label" htmlFor="sku">
                                SKU:
                            </label>
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                className={`add_product_input ${errors.sku ? 'input-error' : ''}`}
                                {...register('sku', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                        {/*------------------------------\\ Title //-----------------------------------*/}
                        <div className=''>
                            <label className="add_product_label" htmlFor="title">
                                Nombre producto:
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                defaultValue='Calcetín de '
                                className={`add_product_input ${errors.title ? 'input-error' : ''}`}
                                {...register('title', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                        {/*------------------------------\\ Description //-----------------------------------*/}
                        <div className=''>
                            <label className="add_product_label" htmlFor="description">
                                Descripcion:
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                defaultValue='Calcetín con tematica de '
                                className={`add_product_input ${errors.description ? 'input-error' : ''}`}
                                {...register('description', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                        <div className="add_product_group_elements_container">
                            {/*------------------------------\\ Stock //-----------------------------------*/}
                            <div className='add_product_group_elements'>
                                <label className="add_product_label" htmlFor="stock">
                                    Stock:
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    className={`add_product_input ${errors.stock ? 'input-error' : ''}`}
                                    {...register('stock', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            {/*------------------------------\\ Peso //-----------------------------------*/}
                            <div className='add_product_group_elements'>
                                <label className="add_product_label" htmlFor="weight">
                                    Peso:
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    step="0.01"
                                    className={`add_product_input ${errors.weight ? 'input-error' : ''}`}
                                    {...register('weight', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            {/*------------------------------\\ Precio base costo //-----------------------------------*/}
                            <div className='add_product_group_elements'>
                                <label className="add_product_label" htmlFor="cost_price">
                                    PP:
                                </label>
                                <input
                                    type="number"
                                    id="cost_price"
                                    name="cost_price"
                                    step="0.01"
                                    className={`add_product_input ${errors.cost_price ? 'input-error' : ''}`}
                                    {...register('cost_price', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            {/*------------------------------\\ PVP //-----------------------------------*/}
                            <div className='add_product_group_elements'>
                                <label
                                    className="add_product_label"
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
                                    defaultValue="5.00"
                                    className={`add_product_input ${errors.sell_price ? 'input-error' : ''}`}
                                    {...register('sell_price', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                        </div>

                        <div className="add_product_group_elements_container">
                            {/*------------------------------\\ Size //-----------------------------------*/}
                            <div className='add_product_group_elements'>
                                <label htmlFor="sizeId" className='add_product_label'>
                                    Talla:
                                </label>
                                <select
                                    name="sizeId"
                                    id="sizeId"
                                    className={`add_product_select ${errors.sizeId ? 'input-error' : ''}`}
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
                            <div className='add_product_group_elements'>
                                <label htmlFor="collectionId" className='add_product_label'>
                                    Coleccion:
                                </label>
                                <select
                                    name="collectionId"
                                    id="collectionId"
                                    className={`add_product_select ${errors.collectionId ? 'input-error' : ''}`}
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

                        <div className="add_product_group_elements_container">
                            {/*------------------------------\\ Category //-----------------------------------*/}
                            <div className='add_product_group_elements'>
                                <label htmlFor="categoryId" className='add_product_label'>
                                    Categoria:
                                </label>
                                <select
                                    name="categoryId"
                                    id="categoryId"
                                    className={`add_product_select ${errors.categoryId ? 'input-error' : ''}`}
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
                            <div className='add_product_group_elements'>
                                <label htmlFor="supplierId" className='add_product_label'>
                                    Proveedor:
                                </label>
                                <select
                                    name="supplierId"
                                    id="supplierId"
                                    className={`add_product_select ${errors.supplierId ? 'input-error' : ''}`}
                                    {...register('supplierId', { required: 'Este campo es obligatorio' })}
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

                        <div className="add_product_button_container">
                            <button
                                className="add_product_button_add"
                                type="submit"
                            >
                                Agregar
                            </button>

                            <button
                                className="add_product_button_cancel"
                                onClick={() => setIsModalProduct(false)}
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

export default AddProducts