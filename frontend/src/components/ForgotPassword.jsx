import React, { useCallback, useState } from 'react'
import Modal from './Modal'
import Dropdown from './Dropdown'
import { handleNumericInput } from '../utils';

export default function ForgotPassword({openForgotPasswordModal,setOpenForgotPasswordModal}) {


    const [data,setData] = useState({
        role:"",
        phno:"",
    });

    const updateData = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setData((old)=>({...old,[name]:value}))
    }   

    

    const changeRole = useCallback((value)=>{
        setData((old)=>({...old,role:value}))
    })

    const roles = [{name:"Faculty"},{name:"Student"}];

  return (
    <Modal isOpen={openForgotPasswordModal} close={setOpenForgotPasswordModal} heading={"Forgot Password"}>
        <section className='p-3'>
            <section className="px-3 my-2">
            <label className='mx-2'>Select Your Role : </label>
                <Dropdown dataArr={roles} selected={data?.role} setSelected={changeRole} label={"Select Your Role"} />
            </section>
            <section className="px-3 my-4">
            <label className='mx-2'>Enter Your Mobile Number : </label>
                <input type="text" name="phno" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter Your Registered Mobile Number' value={data?.phno} onChange={updateData} onKeyDown={handleNumericInput} />
            </section>
            <section className="px-3 my-4">
                <button className='px-5 py-2 bg-green-500 text-white rounded-lg shadow-md'>
                    Send OTP
                </button>
            </section>
        </section>
        
    </Modal>
  )
}
