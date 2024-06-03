import React, { useEffect, useRef, useState } from 'react';
import getApiProducts from '../../hooks/products/apiProducts';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import getConfigAuth from '../../../../utils/getConfigAuth';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { createProductImagesTagsSize } from '../../../../utils/addImages'


const AddProduct = ({ setIsModalCreate, setUpdate }) => {
  const MySwal = withReactContent(Swal);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { supplierAPI, getSupplier, categoryAPI, getCategory, sizeAPI, getsize, collectionAPI, getCollection } = getApiProducts();

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm();
  const [tags, setTags] = useState([]);
  const [selectedImages, setSelectedImage] = useState(null);
  const [imageFiles, setImageFile] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleModal = () => {
    setIsModalCreate(false);
  }

  useEffect(() => {
    getSupplier()
    getCategory()
    getsize()
    getCollection()
  }, [])

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


  const submitProduct = async (data) => {
    console.log(data)
    if (!imageFiles) {
      MySwal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: 'Debes seleccionar una imagen.',
      });
      return;
    }

    try {

      // Luego, crea el producto con la URL de la imagen
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

      const product = await axios.post(`${apiUrl}/products`, productData, getConfigAuth());
      const productId = product.data.id

      if (productId) {
        await createProductImagesTagsSize(imageFiles, productId, data, tags);
        setIsModalCreate(false)
      }



    } catch (error) {
      console.error(error);

      MySwal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: 'Hubo un problema al crear el producto.',
      });
    } finally {
      setUpdate(prev => !prev)
    }
  }


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

  return (
    <>
      <div className='fixed inset-0 flex items-center justify-center z-50'>
        <div className="flex absolute inset-0 z-[-1] backdrop-blur-sm" onClick={handleModal}></div>
        <form action="" className="bg-waikana-gray-300 text-waikana-gray-950 p-4 shadow-xl  rounded-lg flex flex-col gap-2 max-w-[850px]" onSubmit={handleSubmit(submitProduct)}>
          <div className='bg-waikana-gray-800 text-waikana-gray-50 rounded-lg mb-4'>
            <p className='text-lg font-semibold p-4'>Agregar producto</p> 
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
                    src={URL.createObjectURL(selectedImages)}
                    alt="Imagen seleccionada"
                    className="w-full h-full bg-center rounded-md object-cover aspect-square border-2 border-waikana-gray-600"
                  />

                ) : (
                  <p className="text-white w-full h-full p-12 cursor-pointer flex items-center justify-center">
                    ¡Agregar imagenes!
                  </p>
                )}


              </div>


              <div className="  flex h-20 gap-2  py-2 px-2 relative justify-center">
                <div className='absolute left-0 text-lg text-black rounded-full translate-y-1/2 cursor-pointer' onClick={handlePreviousImage}>
                  <i className='bx bx-chevron-left text-base'></i>
                </div>

                <div className='w-[90%] flex  gap-1 absolute'>
                  {imageFiles.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Miniatura ${index + 1}`}
                        className={`w-16 h-16 rounded-md cursor-pointer ${selectedImages === image ? "border-2 border-waikana-gray-600" : ""}`}
                        onClick={() => handleThumbnailClick(index)}
                      />
                      <div
                        className='absolute top-0 right-0 text-white rounded-full cursor-pointer'
                        onClick={() => handleRemoveImage(index)}
                      >
                        <i className='bx bx-x'></i>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className=' absolute right-0 text-lg text-black rounded-full translate-y-1/2 cursor-pointer' onClick={handleNextImage}>
                  <i className='bx bx-chevron-right text-base'></i>
                </div>
              </div>

              <div>
                <label className='px-2 font-semibold'>Tags</label>
                <TagsInput
                  value={tags}
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
                  className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 
                  ${errors.title  ? 'bg-red-100' : 'border-gray-300'
                  }`}
                  {...register('title')}
                />
                {errors.title && <p>{errors.title.message}</p>}
              </div>
              <div>
                <label className='px-2 font-semibold' htmlFor="title">Descripcion</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className="w-full border h-[115px] border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  {...register('description', { required: 'Este campo es obligatorio' })}
                />
                {errors.description && <p>{errors.description.message}</p>}
              </div>
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <label className='px-2 font-semibold' htmlFor="size">Coleccion</label>
                  <select
                    id="collection"
                    name="collection"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    {...register('collection', { required: 'Este campo es obligatorio' })}
                  >
                    <option value="">Seleccione uno</option>
                    {collectionAPI
                      ?.slice() // Hacer una copia del array para no modificar el original
                      .sort((a, b) => a.name.localeCompare(b.name)) // Ordenar alfabéticamente
                      .map((name) => (
                        <option key={name.id} value={name.id}>
                          {name.name}
                        </option>
                      ))}
                  </select>
                </div>
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
                    <label className='px-2 font-semibold' htmlFor="price">Venta unidad</label>
                    <input
                      type="number"
                      id="sell_price"
                      name="sell_price"
                      step="any"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                      {...register('sell_price', { required: 'Este campo es obligatorio' })}
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
                    <label className='px-2 font-semibold' htmlFor="size">Talla</label>
                    <select
                      id="size"
                      name="size"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                      {...register('size', { required: 'Este campo es obligatorio' })}
                    >
                      <option value="">Seleccione uno</option>
                      {sizeAPI?.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.size}
                        </option>
                      ))}
                    </select>
                  </div>



                  <div className='flex-1'>
                    <label className='px-2 font-semibold' htmlFor="size">Proveedor</label>

                    <select
                      id="supplier"
                      name="supplier"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                      {...register('supplier', { required: 'Este campo es obligatorio' })}
                    >
                      <option value="">Seleccione uno</option>
                      {supplierAPI?.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.company}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className='flex-1'>
                    <label className='px-2 font-semibold' htmlFor="size">Categoria</label>
                    <select
                      id="category"
                      name="category"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                      {...register('category', { required: 'Este campo es obligatorio' })}
                    >
                      <option value="">Seleccione uno</option>
                      {categoryAPI?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              <div className='flex mt-4 gap-4 justify-end'>
                <button className='bg-waikana-gray-600 hover:bg-waikana-gray-700 text-waikana-gray-50 font-semibold py-1 px-3 rounded'>Agregar</button>
                <button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded' onClick={handleModal}>Cancelar</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
export default AddProduct;
