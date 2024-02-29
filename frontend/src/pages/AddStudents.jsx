import React, { useEffect, useState } from 'react'
import { formatFileSize } from '../utils';
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";
import axios from 'axios';
import { toast } from 'react-toastify';
import Overlay from "../components/Overlay";
import AddIndividualStudent from '../components/AddIndividualStudent';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AddStudents() {

    const [fileToUpload, setFileToUpload] = useState(null);
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;
    const [showOverLay, setShowOverLay] = useState(false);


    const fileUploadHandler = async (e) => {
        e.preventDefault();
        setShowOverLay((old) => !old);
        const formData = new FormData();
        formData.append("studentcsv", fileToUpload);
        try {

            const { data } = await axios.post(`${API_URL}/api/students/registerInBulk`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    "auth-token": token,
                },
            })
            if (data?.result) {
                toast.success(data?.message);
                if (data?.invalidRecords) {
                    // Convert each object in invalidRecords to a string representation
                    const content = data.invalidRecords.map(record => JSON.stringify(record)).join('\n');
            
                    // Create a Blob object with the content and set its type
                    const blob = new Blob([content], { type: 'text/plain' });
                
                    // Create a URL for the Blob object
                    const url = URL.createObjectURL(blob);
                
                    // Create a link element with the URL and other attributes
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = "invalid_records.txt";
                
                    // Simulate a click on the link to trigger the download
                    link.click();
                
                    // Clean up
                    URL.revokeObjectURL(url);
                }
            }
            
            setFileToUpload(null);


        } catch (error) {
            toast.error("Check Your CSV File Structure");
        }
        finally {

            setShowOverLay((old) => !old);
        }
    
    }

    const showCSVHandler = () =>{
        window.open(`${API_URL}/sampleFiles/Sample CSV For Student.csv`,"_blank")
    }

    const user = useSelector((state)=>state.UserSlice);
    const navigate = useNavigate();
    

    useEffect(()=>{
        if(!user || user?.role === "") return;
        if(user.role !== "Super Admin"){
            navigate("/home");
        }
        // console.log("called")
        setShowOverLay(false)
    },[user])


    return (
        <section className='pt-3 pb-6'>
            {
                showOverLay &&
                <Overlay />
            }
            <section className='md:p-2 md:m-2  p-1 m-1'>
                <section className="md:flex justify-start gap-5 items-center">
                    <p className='lg:py-2 lg:px-3 lg:text-base py-1 px-2  bg-blue-500 text-white w-fit rounded-lg shadow-md'>Add Student Data in Bulk </p>
                    <button className='lg:py-2 lg:px-3 my-2 md:my-0 lg:text-base py-1 px-2  bg-blue-500 text-white w-fit rounded-lg shadow-md'
                        onClick={showCSVHandler}
                    >
                        Download Sample CSV 
                    </button>
                </section>
                <form method="post" onSubmit={fileUploadHandler} className='px-3 py-2'>
                    <section className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileUploadIcon className="h-10 w-10" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to Upload</span> or Drag and Drop Student CSV  File
                                </p>
                            </section>
                            <section className="mt-2">
                                {fileToUpload !== null ? (
                                    <>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Selected File: {fileToUpload?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Selected File Size : {formatFileSize(fileToUpload?.size || 0)}
                                        </p>
                                    </>
                                ) : null}
                            </section>
                            <input
                                type="file"
                                id="dropzone-file"
                                name="studentcsv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setFileToUpload(file);
                                }}
                                accept=".csv"
                                required
                            />
                        </label>
                    </section>
                    <section className="my-2 p-2">
                        <button type="submit" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500'>Upload File</button>
                    </section>
                </form>

                
            </section>
            <section className="w-full border border-blue-500 my-2"></section>
            <section className='mx-4'>
            <p className='lg:py-2 lg:px-3 lg:text-base py-1 px-2  bg-blue-500 text-white w-fit rounded-lg shadow-md'>Add Student Data individually </p>
                <AddIndividualStudent/>
            </section>
        </section>

    )
}
