import React, { useState } from 'react'
import Modal from './Modal'

export default function AddSubEvents({ openUpdateModal, setOpenUpdateModal, heading ,setData}) {
    const initialState = {
        subEventName :"",
        subEventDetail:"",
        subEventRules:""
    }
    const [subEventData,setSubEventData] = useState(initialState);

    const updateData = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setSubEventData({
            ...subEventData,
            [name]:value
        })
    }

    const addSubEventHandler = (e) =>{
        e.preventDefault();
        setData((old)=>{
           return {
                ...old,
                subEvents:[...old.subEvents,
                    {
                        sId:old.subEvents.length+1,
                        subEventName :subEventData.subEventName,
                        subEventDetail:subEventData.subEventDetail,
                        subEventRules:subEventData.subEventRules,
                    }
                ]
            }
        })
        setSubEventData(()=>initialState)
        setOpenUpdateModal((old)=>!old);
    }

    return (

        <Modal isOpen={openUpdateModal} close={setOpenUpdateModal} heading={heading}>
            <section className='px-5 py-4'>
                <form  method="post" onSubmit={addSubEventHandler}>
                <section className='md:p-2 md:m-2 p-1 m-1' >
                            <label htmlFor="ename">Event Name:</label>
                            <input
                                type="text"
                                name="subEventName"
                                value={subEventData.subEventName}
                                onChange={updateData}
                                placeholder='Enter Event Name'
                                className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                                required
                            />
                        </section>

                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="details">Event Details:</label><br />
                            <textarea
                                name="subEventDetail"
                                value={subEventData.subEventDetail}
                                onChange={updateData}
                                className=' w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                                placeholder="Enter Event Details "
                                required
                            ></textarea>
                        </section>
                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="rules">Rules For Events:</label><br />
                            <textarea
                                name="subEventRules"
                                value={subEventData.subEventRules}
                                onChange={updateData}
                                className=' w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                                placeholder="Enter Rules "
                                required
                            ></textarea>
                        </section>


                    <button type="submit" className=' w-full bg-red-500 px-5 py-3 rounded-md block text-white hover:text-red-500 hover:bg-white hover:outline hover:outline-red-500'> Add Sub Event</button>
                </form>
            </section>
        </Modal>

    )
}

