import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import Dropdown from './Dropdown';
import { handleNumericInput } from '../utils';

export default function AddSubEvents({ openUpdateModal, setOpenUpdateModal, heading, setData, setSubEventDataToUpdate, dataToBeUpdated }) {
    const initialState = {
        subEventName: "",
        ptype: "",
        noOfParticipants: 1,
        subEventDetail: "",
        subEventRules: ""
    }

    const initialErrorState = {
        ptypeErr:""
    }

    const [subEventData, setSubEventData] = useState(initialState);
    const [subEventError, setSubEventError] = useState(initialErrorState);

    const noOfPartcipants = useRef(null);

    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setSubEventData({
            ...subEventData,
            [name]: value
        })
    }

    useEffect(() => {
        if (dataToBeUpdated?.sId) {
            setSubEventData(() => dataToBeUpdated)
        }
        // console.log("data", subEventData, dataToBeUpdated)
    }, [dataToBeUpdated])

    const changeParticipationType = useCallback((value)=>{
        
        if(value==="Individual"){
            setSubEventData((old)=>({...old,ptype:value,noOfParticipants:1}))

            noOfPartcipants.current.disabled = true;
        }
        else{
            noOfPartcipants.current.disabled = false;
            setSubEventData((old)=>({...old,ptype:value}))

        }
    },[setSubEventData])

    const addSubEventHandler = (e) => {



        setData((old) => {
            return {
                ...old,
                subEvents: [...old.subEvents,
                {
                    sId: old.subEvents.length===0?1: old.subEvents.at(-1).sId + 1,
                    subEventName: subEventData.subEventName,
                    ptype: subEventData.ptype,
                    noOfParticipants: subEventData.noOfParticipants,
                    subEventDetail: subEventData.subEventDetail,
                    subEventRules: subEventData.subEventRules,
                }
                ]
            }
        })

        setSubEventData(() => initialState)
        setOpenUpdateModal((old) => !old);
        setSubEventDataToUpdate(() => { });
    }

    const updateHandler = (e) => {

        setData((old) => {
            const otherEvents = old?.subEvents.filter((event) => event?.sId !== dataToBeUpdated?.sId);
            otherEvents.push({
                sId: dataToBeUpdated?.sId,
                subEventName: subEventData.subEventName,
                ptype: subEventData.ptype,
                noOfParticipants: subEventData.noOfParticipants,
                subEventDetail: subEventData.subEventDetail,
                subEventRules: subEventData.subEventRules,
            })
            return {
                ...old,
                subEvents: otherEvents

            }
        })
        setSubEventData(() => initialState)
        setOpenUpdateModal((old) => !old);
        setSubEventDataToUpdate(() => { });

    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(subEventData.ptype===""){
            setSubEventError((old)=>({...old,ptypeErr:"Select Participation Type"}));
            return;
        }

        if (dataToBeUpdated?.sId) {
            updateHandler();
        }
        else {
            addSubEventHandler();
        }
    }

    useEffect(()=>{
        if(openUpdateModal){
            setSubEventData(initialState);
            setSubEventError(initialErrorState);
        }
    },[openUpdateModal])

    return (

        <Modal isOpen={openUpdateModal} close={setOpenUpdateModal} heading={heading}>
            <section className='px-5 py-4'>
                <form method="post" onSubmit={submitHandler}>
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
                        <label htmlFor="ptype">Participation  Type:</label>
                        <Dropdown
                            dataArr={[{ name: "Individual" }, { name: "Group" }]}
                            selected={subEventData.ptype}
                            setSelected={changeParticipationType}
                            name={"ptype"}
                            label={"Select Participation Type"}
                        />
                        {
                            subEventError.ptypeErr !== ""
                            &&
                            <p className="text-red-500">
                                {subEventError.ptypeErr}
                            </p>
                        }
                    </section>
                    <section className='md:p-2 md:m-2  p-1 m-1'>
                        <label htmlFor="nop">Max No Of Team Members:</label>
                        <input type="text"
                            name="noOfParticipants"
                            min={1}
                            ref={noOfPartcipants}
                            value={subEventData.noOfParticipants}
                            onChange={updateData}
                            onBlur={(e) => {
                                if (e.target.name === "noOfPartcipants") {
                                    if (Number(e.target.value) < 1) {
                                        setSubEventData({ ...subEventData, [e.target.name]: 1 });
                                        return;
                                    }
                                }
                            }}
                            placeholder='Enter No Of Participants'
                            className='block shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            onKeyDown={handleNumericInput}
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

                    {
                        dataToBeUpdated?.sId
                            ?
                            <button type="submit" className=' w-full bg-red-500 px-5 py-3 rounded-md block text-white hover:text-red-500 hover:bg-white hover:outline hover:outline-red-500'> Update Sub Event</button>
                            :
                            <button type="submit" className=' w-full bg-red-500 px-5 py-3 rounded-md block text-white hover:text-red-500 hover:bg-white hover:outline hover:outline-red-500'> Add Sub Event</button>
                    }
                </form>
            </section>
        </Modal>

    )
}

