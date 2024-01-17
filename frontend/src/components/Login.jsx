import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setNewUser } from '../store/UserSlice';
import Overlay from "./Overlay"
export default function Login() {

    const [data,setData] = useState({
        email:"",
        password:""
    });
    const [isLoading,setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_BASE_URL;

    const updateData = (e) =>{
        setData({...data,[e.target.name]:e.target.value});
    }

    

    const submitHandler = async(e) =>{
        setIsLoading(()=>true);
        e.preventDefault();

        try {
            
            const response = await axios.post(`${API_URL}/api/faculties/login`,data);
            console.log(response.data.data)
            if(response.data.result){
                    localStorage.setItem("token",response.data.token);
                    toast.success(response.data.message);
                    dispatch(setNewUser({_id:response.data.data._id,
                    name:response.data.data.name,
                    role : response.data.data.role,
                }))
                navigate("/home");
            }
            else{
                toast.error(response?.data.message);
            }
        } catch ({response}) {
            toast.error(response?.data.message);
        }
        finally{
            setIsLoading(()=>false);
        }
    }


  return (
    <>

    {
        isLoading &&
        <Overlay/>
    }


    <section className='flex justify-center items-center my-5'>
        <section className='p-5 md:p-10 shadow-2xl bg-white rounded-lg m-5 '>
            <p className='text-2xl text-center text-red-500'>Login</p>
            <form  method="post" onSubmit={submitHandler} className='p-4'>
            <section className='md:p-2 md:m-2 p-1 m-1' >
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={data.email} onChange={updateData} placeholder='Enter Email' className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'/>
                </section>
               <section className='md:p-2 md:m-2  p-1 m-1'>
                    <label htmlFor="Password">Password:</label>
                    <input type="Password" name="password" value={data.password} onChange={updateData} placeholder='Enter Password' className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'/>
                </section>
                <section className='md:p-2 md:m-2  p-1 m-1'>
                    <input type="submit" value="Login" className='text-red-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                </section>
            </form>
        </section>
    </section>
    </>
  )
}
