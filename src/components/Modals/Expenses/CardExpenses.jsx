import React from 'react';

const CardExpenses = ({ color, title }) => {
    return (

        <div className={` flex-1 rounded-lg p-5 ${color}`}>
            <h3 className='text-white font-semibold text-lg'>{title}</h3>
            <div className='flex space-x-8'>
                <div>
                    <p className='text-white font-semibold text-[50px] px-5'>$</p>
                </div>
                <div>
                    <p className='text-white font-semibold text-[50px]'>3500.00</p>
                </div>
            </div>
        </div>

    );
};

export default CardExpenses