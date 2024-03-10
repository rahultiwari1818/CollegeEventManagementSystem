import React from 'react'
import Modal from './Modal'

export default function CancelEvent({ openCancelCnfModal, setOpenCancelCnfModal, changeEventStatus }) {
    return (
        <Modal isOpen={openCancelCnfModal} close={setOpenCancelCnfModal} heading={"Cancel Event"}>
            <section className="py-3">
                <section className='text-center text-red-500'>
                    Are You Sure to Cancel Event ?
                </section>
                <section className='flex gap-5 justify-around items-center py-2 md:py-5'>
                    <button className='px-5 py-4 bg-white text-blue-500 outline outline-blue-500 hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white rounded-lg'
                        onClick={() => { setOpenCancelCnfModal(!openCancelCnfModal) }}
                    >No</button>
                    <button className='px-5 py-4 bg-white text-red-500 outline outline-red-500 hover:bg-red-500 hover:text-white rounded-lg'
                        onClick={() => {
                            changeEventStatus("cancel")
                            setOpenCancelCnfModal((old) => !old);
                        }}
                    >Yes</button>
                </section>
            </section>

        </Modal>
    )
}
