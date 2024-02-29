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
        if(!user || user?.role == "" || user?.role === undefined) return;
        console.log("role",user.role)
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
            <section className='lg:flex justify-center items-start gap-10'>
                <AddCourse />
                <ViewCourses />
            </section>
        </section>
        </>
    )
}
