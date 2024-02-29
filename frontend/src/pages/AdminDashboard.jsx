import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Overlay from '../components/Overlay';

export default function AdminDashboard() {

    const [showOverLay,setShowOverLay] = useState(true)
    const userData = useSelector((state)=>state.UserSlice);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!userData) return;
        if(userData.role !== "Super Admin"){
            navigate("/home");
        }
        setShowOverLay(false);
    },[userData])


  return (
    <>
    {
        showOverLay
        &&
        <Overlay showWhiteBg={true}/>
    }
    <section>
      
    </section>
    </>
  )
}
