import React, { useEffect, useState } from 'react'
import AddEventType from '../components/AddEventType'
import ViewEventType from '../components/ViewEventType'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Overlay from '../components/Overlay';

export default function EventType() {
    const user = useSelector((state)=>state.UserSlice);
    const navigate = useNavigate();
    const [showOverLay,setShowOverLay] = useState(true);
    
    useEffect(()=>{
        if(!user || user?.role === "" || user?.role === undefined) return;
        if(user.role !== "Super Admin"){
            navigate("/home");
        }
        // console.log("called")
        setShowOverLay(false)
    },[user,navigate])

    return (
        <>
        {
            showOverLay
            &&
            <Overlay/>
        }
            <section className='flex justify-center items-center my-5'>
                <section className='lg:flex justify-center items-start gap-5'>
                    {/* <AddEventType /> */}
                    <ViewEventType />
                </section>
            </section>
        </>
    )
}
