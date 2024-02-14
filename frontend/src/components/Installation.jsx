import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Overlay from './Overlay';
import { handleNumericInput } from '../utils';
export default function Installation() {
    
    const initialState = {
        collegename:"",
        sadminname:"",
        sadminemail:"",
        sadminphno:"",
        sadminpassword:""
    };

    const [data,setData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_BASE_URL;

    const updateData = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setData({...data,[name]:value});

    }

    const  fetchFacultiesData  = useCallback(async()=>{

        try {
            
            const response = await axios.get(`${API_URL}/api/faculties/isSetUpDone`);
                // console.log(response)
            if(response.data.isSetUp){
                navigate("/login");
            }
            // setIsLoading(false);

        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }
    },[])

    


    const onSubmitHandler = async(e) => {
        setIsLoading(()=>true);
        e.preventDefault();
        console.log("logged")
        try {
            const response = await axios.post(`${API_URL}/api/faculties/setup`,
                data
            );

            // console.log(response)

            if(response.data.result){
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
            setData(()=>initialState)
            navigate("/login");
        } catch ({response}) {
            console.log(response)
            toast.error(response.data.message)
        }
        finally{
            setIsLoading(()=>false);
        }
        
        
    }

    useLayoutEffect(()=>{
        fetchFacultiesData();
    },[fetchFacultiesData])

    



    return (
        <>
        {
            isLoading &&
            <Overlay/>
        }
        <section className='flex justify-center items-center '>
            <section className='p-5 md:p-10 shadow-2xl bg-white md:outline-none outline outline-blue-500 md:mt-0 md:mb-0 mt-2 '>
                <p className='text-2xl text-center text-red-500 bg-blue-500 p-2'>Set Up System</p>
                <form method="post" className='p-4' onSubmit={onSubmitHandler}>
                    <section className='md:p-2 md:m-2 p-1 m-1'>
                        <label htmlFor="ename">College Name:</label>
                        <input
                            type="text"
                            name="collegename"
                            value={data.collegename}
                            onChange={updateData}
                            placeholder='Enter College Name'
                            className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            required
                        />
                    </section>
                    {/* <section className='md:flex md:justify-between md:items-center block '>

                        <section className='md:p-2 md:m-2  p-1 m-1'>
                        <p className='py-2'>Upload College Logo :</p>

                            <section className="flex items-center justify-center w-full p-2">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col px-2 items-center text-white justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                > 
                                    <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUploadIcon/>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop College Logo
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">

                                        </p>
                                    </section>
                                    <section className="mt-2">
                                        {data.collegelogo ? (
                                            <>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File: {data.collegelogo.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File Size : {formatFileSize(data.collegelogo.size)}
                                                </p>
                                            </>
                                        ) : null}
                                    </section>
                                    <input
                                        type="file"
                                        id="dropzone-file"
                                        name="ebrochure"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setData({ ...data, collegelogo: file });
                                        }}

                                    />
                                </label>
                            </section>

                        </section>
                    </section> */}
                   <section className='md:p-2 md:m-2 p-1 m-1'>
                   <label htmlFor="sadminname">Super Admin Name:</label>
                        <input
                            type="text"
                            name="sadminname"
                            value={data.sadminname}
                            onChange={updateData}
                            placeholder='Enter Name of Super Admin'
                            className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            required
                        /> 
                   </section>
                   <section className='md:p-2 md:m-2 p-1 m-1'>
                   <label htmlFor="sadminemail">Super Admin's Email:</label>
                        <input
                            type="email"
                            name="sadminemail"
                            value={data.sadminemail}
                            onChange={updateData}
                            placeholder='Enter Email of Super Admin'
                            className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            required
                        /> 
                   </section>
                   <section className='md:p-2 md:m-2 p-1 m-1'>
                   <label htmlFor="sadminphno">Super Admin's Phone Number:</label>
                        <input
                            type="tel"
                            name="sadminphno"
                            value={data.sadminphno}
                            onChange={updateData}
                            placeholder='Enter Phone Number of Super Admin'
                            className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            onKeyDown={handleNumericInput}
                            required
                        /> 
                   </section>
                   <section className='md:p-2 md:m-2 p-1 m-1'>
                   <label htmlFor="sadminpasswd">Super Admin's Password:</label>
                        <input
                            type="password"
                            name="sadminpassword"
                            value={data.sadminpassword}
                            onChange={updateData}
                            placeholder='Enter Password of Super Admin'
                            className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            required
                        /> 
                   </section>
                    <section className='md:p-2 md:m-2  p-1 m-1'>
                        <input type="submit" value="Finish Set Up" className='cursor-pointer text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                    </section>
                </form>
            </section>
        </section>

        </>
    )
}