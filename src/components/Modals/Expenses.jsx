import React, { useEffect, useState } from 'react'
import CardExpenses from './Modals/Expenses/CardExpenses'
import TableExpenses from './Modals/Expenses/TableExpenses';
import getApiExpenses from '../hooks/expenses/getApiExpenses';

const Expenses = () => {
  const { expensesAPI, getExpenses } = getApiExpenses()

  useEffect(() => {
    getExpenses()
}, [])

  const colorCard = [
    'bg-gradient-to-br from-blue-400 to-blue-600 ',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',    
    'bg-gradient-to-br from-orange-400 to-orange-600',
  ];

  return (
    <div className='flex p-8'>
      <div className='flex flex-col w-full'>
        <div className='flex justify-center gap-4 flex-wrap'>
          <CardExpenses color={colorCard[0]} title={'Total gasto'} />
          <CardExpenses color={colorCard[3]} title={'Pendiente'} />
          <CardExpenses color={colorCard[1]} title={'Gasto mensual anuncios'} />
          <CardExpenses color={colorCard[2]} title={'Servicios basicos'} />          
          <CardExpenses color={colorCard[4]} title={'Mercaderia'} />
        </div>
        <div className='flex flex-wrap gap-4'>
          <TableExpenses expensesAPI={expensesAPI} title={'Registro de compras'} />
          <TableExpenses expensesAPI={expensesAPI} title={'Cuentas por pagar'} />
        </div>

      </div>
    </div>
  );
};

export default Expenses;

