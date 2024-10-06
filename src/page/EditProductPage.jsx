

import React, { useEffect, useState } from "react"
import './css/EditProductPage.css'
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { allCategoriesProductsThunk, allCollectionProductsThunk, allSizesProductsThunk, allSupplierProductsThunk, updateProductThunk } from "../store/slices/products.slice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import getConfigAuth from "../utils/getConfigAuth";
import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Swal from "sweetalert2";



const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm();

  const [product, setProduct] = useState([])
  const [tagsIdDelete, setTagsIdDelete] = useState([])
  const [imageFiles, setImageFiles] = useState([]);

  const [selectedImages, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageIdsToDelete, setImageIdsToDelete] = useState([])
  const [tags, setTags] = useState([]);

  const [imgFetchApi, setImgFetchApi] = useState([]);
  const [imgtoToLoad, setImgToLoad] = useState([]);


  useEffect(() => {
    if (id) {
      axios.get(`${apiUrl}/products/search/${id}`, getConfigAuth())
        .then(res => {         
          setProduct(res.data)
          setImageFiles(res.data.productImgs)
          setTags(res.data.tags)
        })
        .catch(err => console.log(err))

    }
  }, [])



  /* Hooks */
  const dispatch = useDispatch();

  /* Estados Globales Redux*/
  const sizes = useSelector(state => state.products.sizesStore)
  const collections = useSelector(state => state.products.collectionsStore)
  const categories = useSelector(state => state.products.categoryProductStore)
  const suppliers = useSelector(state => state.products.suppliersStore)

  useEffect(() => {
    dispatch(allCategoriesProductsThunk());
    dispatch(allSizesProductsThunk());
    dispatch(allCollectionProductsThunk());
    dispatch(allSupplierProductsThunk());
  }, [dispatch]);






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

    try {
      const result = await dispatch(updateProductThunk(id, data, imgtoToLoad, imageIdsToDelete, tags, tagsIdDelete))

      if (result) {
        setImageIdsToDelete([]);
        setTagsIdDelete([])
      }

      handleNavigate(result);
    } catch (error) {
      console.error('Error al agregar el producto:', error);

    }
  };

  const handleNavigate = (isSuccess) => {
    const title = isSuccess ? 'El producto actualizado' : 'Error en el producto';
    const text = isSuccess ? 'El producto se ha actualizado correctamente' : 'Error en el producto';
    const icon = isSuccess ? 'success' : 'error';

    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Salir',
      showCancelButton: true, // Cambiado a true para mostrar el botón de cancelar
      cancelButtonText: 'Modificar' // Añadido para el texto del botón de cancelar
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/inventory');
      }
    });
  };


  const handleNavigateExit = () => {
    navigate('/inventory');
  }

  // Inicializar los valores cuando el producto esté disponible
  useEffect(() => {
    if (product) {     
      setValue('title', product.title || '');
      setValue('SKU', product.sku || '');
      setValue('description', product.description || '');
      setValue('new_product', product.new_product || false);
      setValue('stock', product.stock || 0);
      setValue('weight', product.weight || 0);
      setValue('cost_price', product.cost_price || 0)
      setValue('sell_price', product.sell_price || 0)
      setValue('sizeId', product.sizeId || '');
      setValue('collectionId', product.collectionId || '');
      setValue('categoryId', product.categoryId || '');
      setValue('supplierId', product.supplierId || '');
      setValue('deleted_at', product.deleted_at || false);
    }
  }, [product, setValue]);

  

  return (
    <>
      <div className="edit_product_page_container">
        <form action="" className="edit_product_page_form" onSubmit={handleSubmit(submit)}>
          <div className='edit_product_page_title_container'>
            <p className='edit_product_page_title'>Editar Producto</p>
          </div>
          {/*------------------------------\\ Image //-----------------------------------*/}
          <div className="edit_product_page_image_container">
  {selectedImages ? (
    <img
      src={
        selectedImages?.url_small
          ? selectedImages.url_small
          : URL.createObjectURL(selectedImages)
      }
      alt="Imagen seleccionada"
      className="edit_product_page_image"
      loading="lazy"
    />
  ) : (
    imageFiles.length > 0 && (
      <img
        src={
          imageFiles[0]?.url_small
            ? imageFiles[0].url_small
            : URL.createObjectURL(imageFiles[0])
        }
        alt="Imagen principal"
        className="edit_product_page_image"
        loading="lazy"
      />
    )
  )}
</div>


          {/*------------------------------\\ Images Load  //-----------------------------------*/}

          <div className='edit_product_page_images_load_container'>
  {imageFiles.length === 0 && <p className="edit_product_page_img_msj">¡Carge Imagenes!</p>}
  {
    imageFiles?.map((image, index) => (
      <div key={index} className="edit_product_page_images_img_container">
        <img
          src={
            // Si la imagen es un archivo local, usa `URL.createObjectURL`, sino usa `url_small`
            image instanceof File 
              ? URL.createObjectURL(image) 
              : image.url_small
          }
          alt={`Miniatura ${index + 1}`}
          className={`edit_product_page_images ${selectedImages === image && "edit_product_page_images_border"}`}
          onClick={() => handleThumbnailClick(index)}
        />
        <div onClick={() => handleRemoveImage(index, image.id ? [image.id] : null)}>
          <i className='bx bx-x edit_product_page_icon_delete_image'></i>
        </div>
      </div>
    ))
  }
</div>


          {/*------------------------------\\ Input img //-----------------------------------*/}

          <Box sx={{ paddingTop: 1 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <Input
                type="file"
                onChange={handleImageUpload}
                inputProps={{ accept: 'image/*', multiple: true }}
                style={{ display: 'none' }}
              />
            </Button>
            {
              imageFiles.length < 4 && (
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  inputProps={{ accept: 'image/*', multiple: true }}
                  style={{ display: 'none' }}
                  fullWidth
                />
              )
            }
          </Box>

          {/*------------------------------\\ Tags //-----------------------------------*/}
          <Box style={{ margin: "15px 0px" }}>
            <TagsInput
              value={tags ? tags.map(tag => (typeof tag === 'object' ? tag.name : tag)) : {}}
              onChange={handleTagsChange}
            />
          </Box>

          {/*------------------------------\\ SKU //-----------------------------------*/}
          <div className="">
            {
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Box style={{ marginTop: 20 }}>
                    <Controller
                      name="SKU"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Este campo es obligatorio' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          id="sku"
                          label="SKU"
                          variant="outlined"
                          style={{ width: "100%" }}
                          error={!!errors.sku}
                          helperText={errors.sku ? errors.sku.message : ''}
                          className={`edit_product_page_input ${errors.sku ? 'input-error' : ''}`}
                        />
                      )}
                    />
                  </Box>
                  <Box style={{ marginTop: 20, gap: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box style={{ flex: 1 }}>
                      <FormControlLabel
                        control={
                          <Controller
                            name="deleted_at"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <Checkbox
                                {...field}
                                checked={field.value}
                                color="primary"
                              />
                            )}
                          />
                        }
                        label="Ocultar"
                        className="edit_product_page_label_check"
                        htmlFor="deleted_at"
                      />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <FormControlLabel
                        control={
                          <Controller
                            name="new_product"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <Checkbox
                                {...field}
                                checked={field.value}
                                color="primary"
                              />
                            )}
                          />
                        }
                        label="Nuevo"
                        className="adit_product_page_label_check"
                        htmlFor="new_product"
                      />
                    </Box>
                  </Box>
                </Box>

                {/*------------------------------\\ Title //-----------------------------------*/}

                <Box style={{ marginTop: 20 }}>
                  <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        id="title"
                        label="Nombre producto"
                        variant="outlined"
                        style={{ width: "100%" }}
                        error={!!errors.title}
                        helperText={errors.title ? errors.title.message : ''}
                        className={`edit_product_page_input ${errors.title ? 'input-error' : ''}`}
                      />
                    )}
                  />
                </Box>
                {/*------------------------------\\ Description //-----------------------------------*/}
                <Box style={{ marginTop: 20 }}>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        id="description"
                        label="Descripcion del producto"
                        variant="outlined"
                        style={{ width: "100%" }}
                        error={!!errors.description}
                        helperText={errors.description ? errors.description.message : ''}
                        className={`edit_product_page_input ${errors.description ? 'input-error' : ''}`}
                      />
                    )}
                  />
                </Box>

                {/*------------------------------\\ Stock //-----------------------------------*/}
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <Box style={{ display: "flex", marginTop: 20, gap: 10 }}>
                    <Box style={{ flex: 1 }}>
                      <Controller
                        name="stock"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            id="stock"
                            label="stock"
                            variant="outlined"
                            error={!!errors.stock}
                            helperText={errors.stock ? errors.stock.message : ''}
                            className={`edit_product_page_input ${errors.stock ? 'input-error' : ''}`}
                          />
                        )}
                      />
                    </Box>

                    {/*------------------------------\\ Peso //-----------------------------------*/}

                    <Box style={{ flex: 1 }}>
                      <Controller
                        name="weight"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            id="weight"
                            label="Peso"
                            variant="outlined"
                            error={!!errors.weight}
                            helperText={errors.weight ? errors.weight.message : ''}
                            className={`edit_product_page_input ${errors.weight ? 'input-error' : ''}`}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  {/*------------------------------\\ Precio base costo //-----------------------------------*/}
                  <Box style={{ display: "flex", marginTop: 20, gap: 10 }}>
                    <Box style={{ flex: 1 }}>
                      <Controller
                        name="cost_price"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            id="cost_price"
                            label="Precio fabricación"
                            variant="outlined"
                            error={!!errors.cost_price}
                            helperText={errors.cost_price ? errors.cost_price.message : ''}
                            className={`edit_product_page_input ${errors.cost_price ? 'input-error' : ''}`}
                          />
                        )}
                      />
                    </Box>
                    {/*------------------------------\\ PVP //-----------------------------------*/}

                    <Box style={{ flex: 1 }}>
                      <Controller
                        name="sell_price"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            id="sell_price"
                            label="Precio de venta"
                            variant="outlined"
                            error={!!errors.sell_price}
                            helperText={errors.sell_price ? errors.sell_price.message : ''}
                            className={`edit_product_page_input ${errors.sell_price ? 'input-error' : ''}`}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box style={{ display: "flex", flexDirection: "column", paddingTop: 20 }}>
                  <Box style={{ display: "flex", gap: 10 }}>
                    <Box style={{ flex: 1 }}>
                      {/*------------------------------\\ Size //-----------------------------------*/}
                      <FormControl style={{ display: "flex", flex: 1 }}>
                        <InputLabel id="shipping-select-label">Talla</InputLabel>
                        <Controller
                          name="sizeId"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Este campo es obligatorio' }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              id="sizeId"
                              label="Talla"
                              value={field.value}
                              onChange={field.onChange}
                              error={!!errors.sizeId}
                            >
                              {sizes?.map((size) => (
                                <MenuItem key={size.id} value={size.id}>
                                  {size.size}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.sizeId && (
                          <FormHelperText error>{errors.sizeId.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>

                    {/*------------------------------\\ Collection //-----------------------------------*/}
                    <Box style={{ flex: 1 }}>
                      <FormControl style={{ display: "flex", flex: 1 }}>
                        <InputLabel id="shipping-select-label">Colección</InputLabel>
                        <Controller
                          name="collectionId"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Este campo es obligatorio' }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              id="collectionId"
                              label="Colección"
                              value={field.value}
                              onChange={field.onChange}
                              error={!!errors.collectionId}
                            >
                              {collections
                                ?.slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((collection) => (
                                  <MenuItem key={collection.id} value={collection.id}>
                                    {collection.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        {errors.collectionId && (
                          <FormHelperText error>{errors.collectionId.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                </Box>

                {/*------------------------------\\ Category //-----------------------------------*/}
                <Box style={{ display: "flex", flexDirection: "column", paddingTop: 20 }}>
                  <Box style={{ display: "flex", gap: 10 }}>
                    <Box style={{ flex: 1 }}>
                      <FormControl style={{ display: "flex", flex: 1 }}>
                        <InputLabel id="shipping-select-label">Categoria</InputLabel>
                        <Controller
                          name="categoryId"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Este campo es obligatorio' }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              id="categoryId"
                              label="Categoria"
                              value={field.value}
                              onChange={field.onChange}
                              error={!!errors.categoryId}
                            >
                              {categories?.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                  {category.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.categoryId && (
                          <FormHelperText error>{errors.categoryId.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>

                    {/*------------------------------\\ Supplier //-----------------------------------*/}
                    <Box style={{ flex: 1 }}>
                      <FormControl style={{ display: "flex", flex: 1 }}>
                        <InputLabel id="shipping-select-label">Categoria</InputLabel>
                        <Controller
                          name="supplierId"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Este campo es obligatorio' }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              id="supplierId"
                              label="Proveedor"
                              value={field.value}
                              onChange={field.onChange}
                              error={!!errors.supplierId}
                            >
                              {suppliers?.map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                  {supplier.company}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.supplierId && (
                          <FormHelperText error>{errors.supplierId.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>

                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ width: '100%', maxWidth: '220px' }}
                  >
                    ACTUALIZAR
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ width: '100%', maxWidth: '220px' }}
                    onClick={handleNavigateExit}
                  >
                    SALIR
                  </Button>
                </Box>
              </>
            }
          </div>
        </form >
      </div >
    </>
  )

}

export default EditProductPage