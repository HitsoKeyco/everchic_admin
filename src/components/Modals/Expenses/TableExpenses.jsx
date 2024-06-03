import React, { useState } from 'react'
import AddExpenses from './AddExpenses'


const TableExpenses = ({ expensesAPI, title }) => {
    const [isModal, isOpenModal] = useState(false)


    const handleModal = () => {
        isOpenModal(!isModal)
    }

    const handleEditClick = () => {

    }

    const handleDeleteClick = () => {

    }

    const handleAddCredit = () => {

    }

    return (
        <>
            <div className=" flex flex-col gap-4 pt-4 flex-1">

                <div className="w-full overflow-x-auto">
                    <div className='flex justify-end gap-4 pt-8'>
                        <div className='flex w-full justify-between items-end p-4'>
                            <h3 className='pl-4 font-semibold text-lg'>{title}</h3>
                            <div className='flex gap-4'>
                                <div>
                                    <button className="text-waikana-gray-50 bg-waikana-gray-800  hover:bg-waikana-gray-900 font-semibold py-2 px-4 rounded" onClick={handleModal} >
                                        Agregar
                                    </button>
                                </div>
                                <div className="">
                                    <input
                                        type="text"
                                        placeholder="Buscar"
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"

                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="min-w-full border">
                        <thead className=''>
                            <tr>
                                <th className="text-start py-2 px-4 bg-gray-200 text-gray-700">Categoria</th>
                                <th className="text-start py-2 px-4 bg-gray-200 text-gray-700">Proveedor</th>
                                <th className="text-start py-2 px-4 bg-gray-200 text-gray-700">Descripcion</th>
                                <th className="text-start py-2 px-4 bg-gray-200 text-gray-700">Fecha de pago</th>
                                <th className="text-start py-2 px-4 bg-gray-200 text-gray-700">Monto</th>
                                <th className="text-start py-2 px-4 bg-gray-200 text-gray-700">Status</th>
                                <th className="text-start py-2 px-4 bg-gray-200 text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                expensesAPI?.map((expense, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4">{expense.categoryExpense.category}</td>
                                        <td className="py-2 px-4">{expense.supplier.company}</td>
                                        <td className="py-2 px-4">{expense.description}</td>
                                        <td className="py-2 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">{expense.amount}</td>
                                        <td className="py-2 px-4">{expense.status}</td>
                                        <td className="py-2 px-4 flex gap-2">
                                            <button className="bg-waikana-gray-800 hover:bg-waikana-gray-700 text-waikana-gray-50 font-semibold py-1 px-3 rounded" data-id={expense.id} onClick={handleEditClick}><i className='bx bx-edit' ></i></button>
                                            <button className="bg-red-500 hover:bg-red-600 text-waikana-gray-50 font-semibold py-1 px-3 rounded" data-id={expense.id} onClick={handleDeleteClick}><i className='bx bxs-trash'></i></button>
                                        </td>
                                    </tr>
                                ))}

                        </tbody>
                    </table>
                </div>

                {
                    isModal && <AddExpenses isOpenModal={isOpenModal} />
                }
            </div>
        </>
    )
}

export default TableExpenses