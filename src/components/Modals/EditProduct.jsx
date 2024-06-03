import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import getApiProducts from '../../../hooks/getApiProducts';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import getConfigAuth from '../../../../utils/getConfigAuth';
import { updateProductImagesTagsSize } from '../../../../utils/addImages';

const EditProduct = ({ isOneProductAPI, setIsModalEdit, sizeAPI }) => {
    const MySwal = withReactContent(Swal);
    const apiUrl = import.meta.env.VITE_API_URL

    const { supplierAPI, getSupplier, categoryAPI, getCategory, updateProduct, deleteTags, createTags } = getApiProducts()
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    const [tags, setTags] = useState([]);
    const [tagsIdDelete, setTagsIdDelete] = useState([])

    const [selectedImages, setSelectedImage] = useState();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageIdsToDelete, setImageIdsToDelete] = useState([])
    const [imageFiles, setImageFiles] = useState([]);

    // estado para almacenar los id de las imagenes agregadas a <img>    
    const [imgFetchApi, setImgFetchApi] = useState([]);
    const [imgtoToLoad, setImgToLoad] = useState([]);


    useEffect(() => {
        addTagsLoad();
        getSupplier();
        getCategory();
    }, []);


    useEffect(() => {
        addTagsLoad();
    }, [isOneProductAPI]);

    useEffect(() => {
        if (isOneProductAPI && isOneProductAPI.productImgs) {
            const fetchedImages = isOneProductAPI.productImgs.map(img => ({
                id: img.id,
                url: img.url
            }));
            setImageFiles(fetchedImages);
        }
    }, [isOneProductAPI]);  // Añadí isOneProductAPI como dependencia para que se ejecute cuando cambie


    const addTagsLoad = () => {
        const addTag = isOneProductAPI.tags.map(tag => ({ id: tag.id, name: tag.name }));
        if (addTag) {
            setTags(addTag); // Agregar los tags al estado
        }
    }

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

    useEffect(() => {
        if (isOneProductAPI) {
            setValue('title', isOneProductAPI.title);
            setValue('cost_price', isOneProductAPI.cost_price);
            setValue('description', isOneProductAPI.description);
            setValue('sku', isOneProductAPI.sku);
            setValue('stock', isOneProductAPI.stock);
            setValue('supplierId', isOneProductAPI.supplier.id)
            setValue('categoryId', isOneProductAPI.category.id)
        }
    }, [isOneProductAPI]);

    const handleModal = () => {
        setIsModalEdit(false)
    }

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

    const handlePreviousImage = () => {
        if (selectedImageIndex === null) {
            return;
        }
        const previousIndex = selectedImageIndex - 1;
        if (previousIndex >= 0) {
            setSelectedImage(imageFiles[previousIndex]);
            setSelectedImageIndex(previousIndex);
        }
    };

    const handleNextImage = () => {
        if (selectedImageIndex === null) {
            return;
        }
        const nextIndex = selectedImageIndex + 1;
        if (nextIndex < imageFiles.length) {
            setSelectedImage(imageFiles[nextIndex]);
            setSelectedImageIndex(nextIndex);
        }
    };

    const handleThumbnailClick = (index) => {
        if (index >= 0 && index < imageFiles.length) {
            setSelectedImage(imageFiles[index]);
            setSelectedImageIndex(index);
        };
    }

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

    const submit = async (data) => {
        console.log(data);
        try {
            if (isOneProductAPI.id) {
                const id = isOneProductAPI.id
                await updateProduct(imageIdsToDelete, data, id)
                setImageIdsToDelete([]);
                // setIsModalEdit(false)
            }

            if (tagsIdDelete.length > 0) {
                const id = isOneProductAPI.id
                await deleteTags(tagsIdDelete, id)
                setTagsIdDelete([])
            }

            if (tags && isOneProductAPI.id) {
                const productId = isOneProductAPI.id

                const urlTags = `${apiUrl}/tags/${productId}/relateTags`;

                axios.post(urlTags, tags, getConfigAuth())
                    .then(res => {     
                        setIsModalEdit(false)
                    })
                    .catch(err => err)
            }

            if(imgtoToLoad && isOneProductAPI.id){
                const id = isOneProductAPI.id

                await updateProductImagesTagsSize( imgtoToLoad, id )
                setIsModalEdit(false)

            }
        } catch {
            console.log("hay un error");
        }
    };


    return (
        <>

            <div className='fixed inset-0 flex items-center justify-center z-50'>
                <div className="flex absolute inset-0 z-[-1] backdrop-blur-sm" onClick={handleModal}></div>
                <form action="" className="bg-waikana-gray-300 text-waikana-gray-950 p-4 shadow-xl  rounded-lg flex flex-col gap-2 max-w-[850px]" onSubmit={handleSubmit(submit)}>
                    <div className='bg-waikana-gray-800 text-waikana-gray-50 rounded-lg mb-4'>
                        <p className='text-lg font-semibold p-4'>Editar producto</p>
                    </div>
                    <div className='flex gap-4'>
                        <div>
                            <div className="w-[300px] h-[300px] bg-slate-400 relative rounded-md">

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                                    multiple
                                />

                                {selectedImages ? (
                                    <img
                                        src={selectedImages.url || URL.createObjectURL(selectedImages)}
                                        alt="Imagen seleccionada"
                                        className="w-full h-full bg-center rounded-md object-cover aspect-square border-2 border-waikana-gray-600"
                                    />)
                                    : (
                                        <img
                                            src={imageFiles[0]?.url}
                                            alt="No existe ninguna imagen!"
                                            className="w-full h-full bg-center rounded-md object-cover aspect-square border-2 border-waikana-gray-600"
                                        />
                                    )
                                }

                            </div>

                            <div className="  flex h-20 gap-2  py-2 px-2 relative justify-center">
                                <div className='absolute left-0 text-lg text-black rounded-full translate-y-1/2 cursor-pointer' onClick={handlePreviousImage}>
                                    <i className='bx bx-chevron-left text-base'></i>
                                </div>

                                <div className='w-[90%] flex gap-1 absolute'>
                                    {
                                        imageFiles.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image.url || URL.createObjectURL(image)}
                                                    alt={`Miniatura ${index + 1}`}
                                                    className={`w-16 h-16 rounded-md cursor-pointer ${selectedImages === image ? "border-2 border-waikana-gray-600" : ""
                                                        }`}
                                                    onClick={() => handleThumbnailClick(index)}
                                                />
                                                <div
                                                    className="absolute top-0 right-0 text-white rounded-full cursor-pointer"
                                                    onClick={() => handleRemoveImage(index, image.id ? [image.id] : null)}
                                                >
                                                    <i className="bx bx-x"></i>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className=' absolute right-0 text-lg text-black rounded-full translate-y-1/2 cursor-pointer' onClick={handleNextImage}>
                                    <i className='bx bx-chevron-right text-base'></i>
                                </div>
                            </div>

                            <div>
                                <label className='px-2 font-semibold'>Tags</label>
                                <TagsInput
                                    value={tags.map(tag => (typeof tag === 'object' ? tag.name : tag))}
                                    onChange={handleTagsChange}
                                    className='max-w-[300px] bg-white focus:outline-none py-2 px-3 focus:border-blue-500 rounded-md'
                                />
                            </div>

                        </div>
                        <div className='flex gap-4 flex-col'>
                            <div>
                                <label className='px-2 font-semibold' htmlFor="title">Titulo</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('title', { required: 'Este campo es obligatorio' })}
                                />
                                {errors.title && <p>{errors.title.message}</p>}
                            </div>
                            <div>
                                <label className='px-2 font-semibold' htmlFor="title">Descripcion</label>
                                <textarea
                                    type="text"
                                    id="description"
                                    name="description"
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('description', { required: 'Este campo es obligatorio' })}
                                />
                                {errors.description && <p>{errors.description.message}</p>}
                            </div>
                            <div className='flex flex-col gap-4'>
                                <div className='flex gap-4'>
                                    <div className='flex-1'>
                                        <label className='px-2 font-semibold' htmlFor="price">Costo unidad</label>
                                        <input
                                            type="number"
                                            id="cost_price"
                                            name="cost_price"
                                            step="any"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            {...register('cost_price', { required: 'Este campo es obligatorio' })}
                                        />
                                        {errors.price && <p>{errors.price.message}</p>}
                                    </div>
                                    <div className='flex-1'>
                                        <label className="px-2 font-semibold" htmlFor="sku">SKU</label>
                                        <input
                                            type="text"
                                            id="sku"
                                            name="sku"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            {...register('sku', { required: 'Este campo es obligatorio' })}
                                        />
                                        {errors.sku && <p>{errors.sku.message}</p>}
                                    </div>
                                    <div className='flex-1'>
                                        <label className='px-2 font-semibold' htmlFor="stock">Stock</label>
                                        <input
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            {...register('stock', { required: 'Este campo es obligatorio' })}
                                        />
                                        {errors.stock && <p>{errors.stock.message}</p>}
                                    </div>
                                </div>


                                <div className='flex gap-4'>
                                    <div className='flex-1'>
                                        <label className='px-2 font-semibold' htmlFor="sizeId">Talla</label>
                                        <select
                                            id="sizeId"
                                            name="sizeId"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            {...register('sizeId', { required: 'Este campo es obligatorio' })}


                                        >
                                            {sizeAPI.map((size) => (
                                                <option
                                                    key={size.id}
                                                    value={size.id}
                                                    defaultValue={size.size === isOneProductAPI.size.size}
                                                >
                                                    {size.size}

                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='flex-1'>
                                        <label className='px-2 font-semibold' htmlFor="category">Proveedor</label>
                                        <select
                                            id="supplier"
                                            name="supplier"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            {...register('supplierId', { required: 'Este campo es obligatorio' })}
                                        >

                                            {supplierAPI?.map((supplier) => (
                                                <option
                                                    key={supplier.id}
                                                    value={supplier.id}
                                                    defaultValue={supplier.company === isOneProductAPI.supplier.company}
                                                >
                                                    {supplier.company}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className='flex-1'>
                                        <label className='px-2 font-semibold' htmlFor="category">Categoría</label>
                                        <select
                                            id="category"
                                            name="category"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            {...register('categoryId', { required: 'Este campo es obligatorio' })}
                                        >

                                            {categoryAPI?.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                    defaultValue={category.name === isOneProductAPI?.category.name}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='flex mt-4 gap-4 justify-end'>
                                <button className='bg-waikana-gray-600 hover:bg-waikana-gray-700 text-waikana-gray-50 font-semibold py-1 px-3 rounded'>Actualizar</button>
                                <button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded' onClick={handleModal} >Cancelar</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditProduct