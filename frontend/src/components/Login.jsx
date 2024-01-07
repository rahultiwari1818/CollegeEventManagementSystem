import React, { useState } from 'react'

export default function Login() {

    const [data,setData] = useState({
        email:"",
        password:""
    });

    const updateData = (e) =>{
        setData(...data,[e.target.name]=e.target.value);
    }

    const submitHandler = (e) =>{
        e.preventDefault();
        console.log("api called")
    }


  return (
    <section className='flex justify-center items-center mt-5'>
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
                    <input type="submit" value="Login" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                </section>
            </form>
        </section>
    </section>
  )
}
