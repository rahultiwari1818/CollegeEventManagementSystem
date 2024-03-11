import React, { useEffect, useState } from 'react'
import ViewEventTypeComp from '../components/ViewEventType'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Overlay from '../components/Overlay';
import { ReactComponent as BackIcon } from "../assets/Icons/BackIcon.svg";

export default function ViewEventTypes() {
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
            <section className='relative py-3'>
				<section className="absolute left-8 md:left-12 top-3 cursor-pointer p-2 md:p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 ">
					<BackIcon
						onClick={() => {
							navigate("/adminDashboard");
						}}
					/>
				</section>
                <section className='my-1  mx-3 flex items-center justify-end '>
                        <Link to="/addEventType" className='px-5 py-2 block my-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:outline hover:outline-yellow-500 hover:bg-white hover:text-yellow-500 '>
                            Add New Event Type
                        </Link>
                </section>
                <section className=' relative md:mt-10 mt-3'>
                    <ViewEventTypeComp />
                </section>
            </section>
        </>
    )
}
