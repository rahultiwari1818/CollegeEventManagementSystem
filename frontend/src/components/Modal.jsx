import React from 'react';
import {ReactComponent as CloseIcon} from "../assets/Icons/CloseIcon.svg";

export default function Modal({ isOpen, close,heading,children }) {
    return (
        <>
            {
                isOpen &&
                <section className='h-screen w-screen right-0 left-0 bottom-0 top-0 fixed bg-gray-100 bg-opacity-70 z-20 flex justify-center items-center'>
                <section className='bg-white rounded-xl shadow-xl w-full  md:max-w-3xl'>
                    <section className='p-2 md:p-5 px-3 py-2 md:px-5 md:py-3 flex justify-between items-center border-b'>
                        <section></section>
                        <section>
                            <p className='text-xl font-bold'>{heading}</p>
                        </section>
                        <section>
                            <CloseIcon className='cursor-pointer' onClick={() => close()} />
                        </section>
                    </section>
                    <section className='p-2 md:p-5 max-h-[80vh] md:max-h-[60vh] overflow-auto'>
                        {children}
                    </section>
                </section>
            </section>
            
            }
        </>
    )
}
