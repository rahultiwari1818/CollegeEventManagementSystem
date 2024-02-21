import React, { useState } from 'react'
import { formatFileSize } from '../utils';
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";
import axios from 'axios';
import { toast } from 'react-toastify';
import Overlay from "../components/Overlay";

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

            if (data?.success) {
                toast.success(data?.message);
            }

            setFileToUpload(null);


        } catch (error) {
            toast.error("Check Your CSV File Structure");
        }
        finally {

            setShowOverLay((old) => !old);
        }
    }


    return (
        <>
            {
                showOverLay &&
                <Overlay />
            }
            <section className='md:p-2 md:m-2  p-1 m-1'>
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
                                aria-required="true"
                            />
                        </label>
                    </section>
                    <section className="my-2 p-2">
                        <button type="submit" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500'>Upload File</button>
                    </section>
                </form>

                
            </section>

        </>

    )
}
