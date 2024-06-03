import React, { useEffect, useState } from 'react';
import AddProduct from './Modals/Product/AddProduct';
import EditProduct from './Modals/Product/EditProduct';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import getApiProducts from '../hooks/getApiProducts';
import { getRandomColorClass } from '../../utils/colorTagsRandom'

const Contact = () => {
    const MySwal = withReactContent(Swal);

    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [update, setUpdate] = useState(false)
    const { productsAPI, getProductsAPI, isOneProductAPI, getOneProduct, sizeAPI, getsize, deleteproduct } = getApiProducts()

    console.log(productsAPI)
    useEffect(() => {
        getProductsAPI()
        getsize()
    }, [isModalCreate, isModalEdit, update]); // Controla la renderización basada en el estado global

    const handdleModal = () => {
        setIsModalCreate(true); // Controlador de modal
    }

    const handleEditClick = async (e) => {
        if (sizeAPI && e) {
            await getOneProduct(e);
            setIsModalEdit(!isModalEdit);
        }

    };

    const handleDeleteClick = async (id) => {
        if (id) {
            MySwal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteproduct(id);                                                
                        setUpdate(prev => !prev)
                        

                    } catch (error) {
                        console.error(error);
                        MySwal.fire({
                            title: 'Error',
                            text: 'Hubo un problema al intentar eliminar el producto.',
                            icon: 'error',
                        });
                    }
                }
            });
        }


        const handleSearchInput = (event) => {
            const searchText = event.target.value;
            setSearchText(searchText); // Actualiza el estado searchText con el valor del input
        };
    }


    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4">Productos</h3>
                    <button className="text-waikana-gray-50 bg-waikana-gray-800  hover:bg-waikana-gray-950 font-semibold py-2 px-4 rounded" onClick={handdleModal}>
                        Agregar Producto
                    </button>
                </div>
                <div className="">
                    <input
                        type="text"
                        placeholder="Buscar producto"
                        className=""
                        // value={searchText} // Enlaza el valor del input al estado searchText
                        // onChange={handleSearchInput} // Maneja el evento onChange para actualizar el estado de búsqueda
                    />
                </div>
                <div className="">
                    <table className="">
                        <thead className=''>
                            <tr className=''>
                                <th className="">SKU</th>
                                <th className="">Imagen</th>
                                <th className="">Titulo</th>
                                <th className="">Descripcion</th>
                                <th className="">Colección</th>
                                <th className="">Stock</th>
                                <th className="">P/unitario</th>
                                <th className="">Talla</th>
                                <th className="">Categoria</th>
                                <th className="">Tags</th>
                                <th className="">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                productsAPI?.map(product => (
                                    <tr key={product.id} className='text-waikana-gray-800'>
                                        <td className="py-2 px-4">{product.sku}</td>
                                        <td className="py-2 px-4 relative group">
                                            <img
                                                className="w-10 h-10 rounded-md cursor-pointer"
                                                src={product.productImgs[0]?.url}
                                                alt=""
                                            />
                                            <div className="fixed hidden group-hover:block rounded-md  p-2 transition-transform transform translate-x-10 top-55 translate-y-[-35px] w-[250px]">
                                                <img
                                                    className="w-full rounded-md cursor-pointer"
                                                    src={product.productImgs[0]?.url}
                                                    alt="img_product"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">{product.title}</td>
                                        <td className="py-2 px-4">{product.description}</td>
                                        <td className="py-2 px-4"><p className=' bg-violet-400 text-waikana-gray-50 pl-1 pr-1 rounded-lg text-center'>{product.collection?.name}</p></td>
                                        <td className="py-2 px-4">{product.stock}</td>
                                        <td className="py-2 px-4">{product.cost_price}</td>
                                        <td className="py-2 px-4">{product.size.size}</td>
                                        <td className="py-2 px-4">{product.category.name}</td>
                                        <td className="py-2 px-4">
                                            {product.tags?.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`inline-block ${getRandomColorClass(tag.name)} text-white rounded-full px-2 py-0.5 text-[13px] font-semibold mr-2`}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="py-2 px-4 flex gap-2">
                                            <button className="bg-waikana-gray-600 hover:bg-waikana-gray-700 text-waikana-gray-50 font-semibold py-1 px-3 rounded" onClick={() => handleEditClick(product.id)}><i className='bx bx-edit' ></i></button>
                                            <button className="bg-red-500 hover:bg-red-600 text-waikana-gray-50 font-semibold py-1 px-3 rounded" onClick={() => handleDeleteClick(product.id)}><i className='bx bxs-trash'></i></button>
                                        </td>
                                    </tr>
                                ))

                            }



                        </tbody>
                    </table>
                </div>
                {
                    isModalCreate ?
                        <AddProduct setIsModalCreate={setIsModalCreate} setUpdate={setUpdate}/>
                        :
                        ''
                }
                {
                    isModalEdit && isOneProductAPI?.productImgs ?
                        <EditProduct setIsModalEdit={setIsModalEdit} sizeAPI={sizeAPI} isOneProductAPI={isOneProductAPI} />
                        :
                        ''
                }
            </div >


        </>

    );
};

export default Contact;
