import React, { useEffect, useState } from 'react'
import ViewEventTypeComp from '../components/ViewEventType'
import { useNavigate } from 'react-router-dom';
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
            <section className=''>
				<section className="absolute left-8 md:left-12 top-20 lg:top-24 cursor-pointer p-2 md:p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 ">
					<BackIcon
						onClick={() => {
							navigate("/adminDashboard");
						}}
					/>
				</section>

                <section className='mt-14'>
                    <ViewEventTypeComp />
                </section>
            </section>
        </>
    )
}
