import React, { useEffect, useState } from 'react'
import AddCourse from '../components/AddCourse'
import ViewCourses from '../components/ViewCourses'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Overlay from '../components/Overlay';

export default function Courses() {
    const user = useSelector((state)=>state.UserSlice);
    const navigate = useNavigate();
    const [showOverLay,setShowOverLay] = useState(true);
    
    useEffect(()=>{
        if(!user) return;
        if(user.role !== "Super Admin"){
            navigate("/home");
        }
        // console.log("called")
        setShowOverLay(false)
    },[user])

    return (
        <>
        {
            showOverLay
            &&
            <Overlay/>
        }
        <section className='flex justify-center items-center'>
            <section>
                <AddCourse />
                <ViewCourses />
            </section>
        </section>
        </>
    )
}
