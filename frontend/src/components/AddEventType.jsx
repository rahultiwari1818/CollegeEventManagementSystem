import React, { useState } from 'react'
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";
import { formatFileSize } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchAllEventTypes } from '../store/EventTypeSlice';
import { useDispatch } from 'react-redux';

export default function AddEventType() {
  
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [data, setData] = useState({
        eventTypeName:"",
        eventTypeLogo:null
    });

    const [fileError,setFileError]= useState("");
    const dispatch = useDispatch();

    const updateData = (e) =>{
        const {name,value} = e.target;
        setData((old)=>({...old,[name]:value}))
    }

    const addEventTypeHandler = async() =>{

        try {
            

            const formData = new FormData();
            formData.append("eventTypeName",data.eventTypeName);
            formData.append("eventTypeLogo",data.eventTypeLogo)
    
            const response = await axios.post(`${API_URL}/api/eventType/addEventType`,formData,{
                headers:{
                    "auth-token":token,
                    "Content-Type":"multipart/form-data"
                }
            })
            if(response.data.result){
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message)
            }

        } catch ({response}) {
            toast.error(response.data.message)
        }
        finally{
            setData({
                eventTypeName:"",
                eventTypeLogo:null
            })
            dispatch(fetchAllEventTypes());

        }

        
    }
    
    return (
        <section className='p-3 rounded-lg border border-blue-500 my-2'>
            <section className='md:p-2 md:m-2 p-1 m-1'>
                <label htmlFor="ename">Add New Event Type:</label>
                <input
                    type="text"
                    name="eventTypeName"
                    value={data.eventTypeName}
                    onChange={updateData}
                    placeholder='Enter Event Type Name'
                    className='w-full shadow-lg md:p-3 rounded-lg p-2 my-2'
                    required
                />
            </section>

            <section className='md:p-2 md:m-2 p-1 m-1'>
                            <section className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzoneForEventTypeLogo"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUploadIcon className="h-10 w-10" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to Upload</span> or Drag and Drop EventType's Logo
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">

                                        </p>
                                    </section>
                                    <section className="mt-2">
                                        {data.eventTypeLogo ? (
                                            <>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File: {data.eventTypeLogo.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File Size : {formatFileSize(data.eventTypeLogo.size)}
                                                </p>
                                            </>
                                        ) : null}
                                    </section>
                                    <input
                                        type="file"
                                        id="dropzoneForEventTypeLogo"
                                        name="eventTypeLogo"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            // console.log("brochure",file);
                                            if (file && file.size > 10485760) {
                                                setFileError((old) => ( "Logo Size Should be less than 10 Mb."))
                                                setData({ ...data, eventTypeLogo: null });
                                            }
                                            else {
                                                setData({ ...data, eventTypeLogo: file });
                                                setFileError((old) => (""))
                                            }
                                        }}
                                        required
                                    />
                                    {
                                        fileError!=="" &&
                                        <p className='text-red-500 py-2'>
                                            {fileError}
                                        </p>
                                    }
                                </label>

                            </section>
                                    </section>

            <section className='md:p-2 md:m-2 p-1 m-1'>
                <button
                    className="text-white bg-red-500 px-5 py-3 rounded-lg shadow-lg hover:text-red-500 hover:bg-white hover:border-red-500 hover:border"
                    onClick={addEventTypeHandler}
                >
                    Add Course
                </button>
            </section>
        </section>

    )
}
