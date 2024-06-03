import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import getApiProducts from '../../../hooks/getApiProducts';
import getApiExpenses from '../../../hooks/expenses/getApiExpenses';

const AddExpenses = ({ isOpenModal }) => {

    const [total0, setTotal0] = useState(0);
    const [total12, setTotal12] = useState(0);
    const [iscredit, isSetCredit] = useState(0); //


    const [isTotal, isSetTotal] = useState(); 
    const [creditPending, setCreditPending] = useState()

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { supplierAPI, getSupplier } = getApiProducts();
    const { expensesAPI, getExpenses, createExpenses, expensesCategoryAPI, getCategoryExpenses, bankAPI, getBank } = getApiExpenses()

    useEffect(() => {
        getSupplier()
        getCategoryExpenses()
        getBank()

    }, [])

    useEffect(() => {
        handleTotal()  
    }, [total0, total12, iscredit])
    
    const handleExitModal = () => {
        isOpenModal(false)
    }




    const handleTotal = () => {
        // Convierte los valores a números y maneja campos vacíos o no numéricos
        const subtotal0 = parseFloat(total0) || 0;
        const subtotal12 = parseFloat(total12) || 0;
        const credit = parseFloat(iscredit) || 0;
        // Calcula el total
        const total = (subtotal0 + ((subtotal12 * 0.12) + subtotal12));
        const valueCredit = total - credit
        isSetTotal(total)
        setCreditPending(valueCredit)
    };

    const submit = (data) => {
        const { ruc, bank, date, max_date, description, paymentMethod, receiptNumber, status, supplier, category, title } = data
        console.log(data);

        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData.id;
        const total = parseFloat(total0) + parseFloat(total12)
        const addData = {
            ruc, bank, categoryExpenseId: category, date, max_date, description, paymentMethod, receiptNumber, status, supplierId: supplier, title, userId, amount: total, sub0: total0, sub12: total12
        }

        if (addData) {
            console.log(addData);
            createExpenses(addData)
            isOpenModal(false)
        }
    }


    return (
        <>
            <div className='fixed inset-0 flex flex-col items-center justify-center z-50'>
                <div className="flex absolute inset-0 z-[-1] backdrop-blur-sm" onClick={handleExitModal}></div>
                <form action="" onSubmit={handleSubmit(submit)}>
                    <div className='bg-waikana-gray-100 text-waikana-gray-950 p-4 shadow-lg rounded-lg flex flex-col gap-4'>
                        <div className='bg-waikana-gray-300 text-waikana-gray-800 rounded-lg'>
                            <p className='text-2xl font-semibold p-4'>Agregar Compra</p>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Titulo</label>
                                <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('title', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Ruc</label>
                                <input type="number" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('ruc', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Descripcion</label>
                                <textarea type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('description', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>N° Factura</label>
                                <input type="number" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('receiptNumber', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Categoria</label>
                                <select name="" id="" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('category', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue>Seleccione uno</option>
                                    {expensesCategoryAPI?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Proveedor</label>
                                <select name="" id="" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('supplier', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue>Seleccione uno</option>
                                    {supplierAPI?.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.company}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Fecha de pago</label>
                                <input type="date" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('date', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Fecha maxima de pago</label>
                                <input type="date" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('max_date', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Metodo de pago</label>
                                <select name="" id="" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('paymentMethod', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="">Seleccione una</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia bancaria">Transferencia Bancaria</option>
                                    <option value="Deposito">Deposito</option>
                                    <option value="Targeta de credito">Tarjeta de credito</option>
                                </select>
                            </div>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Entidad Financiera</label>
                                <select name="" id="" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('bank', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue>Seleccione una</option>
                                    {bankAPI?.map((bank) => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2'>Status</label>
                                <select name="" id="" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    {...register('status', { required: 'Este campo es obligatorio' })}
                                >
                                    <option value="" defaultValue>Seleccione una</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="pagado">Pagado</option>
                                    <option value="rechazado">Rechazado</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex gap-2 '>
                            <div className='flex gap-2'>
                                <div className='flex flex-col flex-1'>
                                    <label htmlFor="" className='pl-2 justify-center'>Subtotal 0%</label>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                        value={total0}
                                        onChange={(e) => {
                                            setTotal0(e.target.value)
                                            
                                        }}
                                    />
                                </div>
                                <div className='flex flex-col flex-1'>
                                    <label htmlFor="" className='pl-2 justify-center'>Subtotal IVA</label>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                        value={total12}
                                        onChange={(e) => {
                                            setTotal12(e.target.value)
                                            
                                        }}
                                    />
                                </div>

                                <div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2 justify-center'>Abono</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    value={iscredit}
                                    onChange={(e) => isSetCredit(e.target.value)}
                                        />                                
                            </div>
                            {/*<div className='flex flex-col flex-1'>
                                <label htmlFor="" className='pl-2 justify-center'>Saldo Pendiente</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    value={CreditPending - (credit+ total12)}
                                    onChange={(e) => {                                        
                                        // Calcula el nuevo total
                                        const creditP = (parseFloat(e.target.value) * 0.12 + parseFloat(e.target.value));
                                        setCreditPending(creditP.toFixed(2)); // Redondea a 2 decimales
                                    }}

                                />
                            </div> */}
                            </div>
                        </div>
                        <div className='flex  mt-4 w-full justify-between items-end'>
                            <div className='flex gap-8'>
                            <div className='flex flex-col font-semibold'>
                                <p className='text-red-500 '>Saldo por pagar</p>
                                <p className='text-[40px] text-red-500 font-semibold'>
                                    $ { creditPending ? (creditPending).toFixed(2) : 0}
                                </p>
                            </div>
                            <div className='flex flex-col font-semibold'>
                                <p className='text-waikana-gray-800 '>Total</p>
                                <p className='text-[40px] text-waikana-gray-800 font-semibold'>
                                    $ { isTotal ? (isTotal).toFixed(2) : 0}
                                </p>
                            </div>
                            </div>
                            <div className='flex gap-4'>
                                <button type="submit" className=' text-waikana-gray-50 bg-waikana-gray-900 h-10 hover:bg-waikana-gray-950  py-2 px-4 rounded '>Aceptar</button>
                                <button className='bg-red-500 hover:bg-red-600 text-white h-10 font-semibold py-2 px-4 rounded' onClick={handleExitModal}>Cancelar</button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}

export default AddExpenses
