import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { formatFileSize, handleNumericInput, isValidPassword, transformCourseData } from '../utils';

import { useDispatch, useSelector } from 'react-redux';
import Dropdown from './Dropdown';
import { fetchAllCourses } from '../store/CourseSlice';
import axios from 'axios';
import {toast} from "react-toastify"
import Overlay from './Overlay';
export default function UpdateStudent({ isOpen, close, heading, dataToBeUpdated = {} }) {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const initialFormData = {
        course: '',
        salutation:"",
        name: '',
        phno: '',
        gender: '',
        password: '',
        // profilePic: null,
        email: ""
    };

    const [formData, setFormData] = useState(dataToBeUpdated);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        setFormData(dataToBeUpdated)
    },[dataToBeUpdated])

    const [errors, setErrors] = useState({
        courseErr: "",
        phnoErr: "",
        salutationErr:""
    })
    const coursesData = useSelector((state) => state.CourseSlice.data);
    const dispatch = useDispatch();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const changeCourse = useCallback((value) => {
        setFormData((old) => ({
            ...old, course: value
        }))
    }, [])

    const changeSalutation = useCallback((value) => {
        setFormData((old) => ({
            ...old, salutation: value
        }))
    }, [])

    const isValidData = () => {
        let result = true;

        if (formData.course === "") {
            result = false;
            setErrors((old) => ({ ...old, courseErr: "Select a Course" }))
        }
        else {
            setErrors((old) => ({ ...old, courseErr: "" }))
        }
        if (formData.salutation === "") {
            result = false;
            setErrors((old) => ({ ...old, salutationErr: "Select a Salutation" }))
        }
        else {
            setErrors((old) => ({ ...old, salutationErr: "" }))
        }
        
        if (formData.phno.length !== 10) {
            result = false;
            setErrors((old) => ({ ...old, phnoErr: "Phone Number Should Have Exactly 10 Digits" }))
        }
        else {
            setErrors((old) => ({ ...old, phnoErr: "" }))
        }

        
        return result;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!isValidData()) return;
        console.log(formData)
        // return;
        try {

            setIsLoading(true);

            const dataToPost = new FormData();
            dataToPost.append('course', formData.course);
            dataToPost.append('name', formData.name);
            dataToPost.append('phno', formData.phno);
            dataToPost.append('salutation', formData.salutation);
            // dataToPost.append('profilePic', formData.profilePic);
            dataToPost.append('email', formData.email);

            const {data} = await axios.post(`${API_URL}/api/faculties/updateFacultyData`, formData, {
                headers: {
                    "auth-token": token,
                    // "Content-Type":"multipart/form-data"
                }
            })

                if (data.result) {
                toast.success(data.message);
                setFormData(initialFormData)
            }
            else {
                toast.error(data.message)

            }
            close();
        } catch (error) {
            console.log(error)

        }
        finally{
            setIsLoading(false);

        }


    };

    useEffect(() => {
        dispatch(fetchAllCourses());
    }, [dispatch])

    const coursesArr = useMemo(() => {
        return transformCourseData(coursesData, false);
    }, [coursesData])

    const salutations = [
        { name: "Mr." },
        { name: "Mrs." },
        { name: "Ms." },
        { name: "Dr." },
        { name: "Asst Prof." },
        { name: "Prin." },
        { name: "Prof.Dr." },
        { name: "I/c. Prin." },
        { name: "Prin. Dr." },
        { name: "I/c. Prin. Dr." }
    ];


    return (

        <>
        {
            isLoading
            &&
            <Overlay/>
        }
        <Modal isOpen={isOpen} close={close} heading={heading}>
                 <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg mx-4 my-3">
            <section className="grid md:grid-cols-2 grid-col-1 gap-4 my-3">

            <section>
                    <label htmlFor="salutation" className="block mb-1">Salutation:</label>
                    <Dropdown
                        dataArr={salutations}
                        selected={formData.salutation}
                        setSelected={changeSalutation}
                        name={"salutation"}
                        label={"Select Salutation"}
                    />
                    {
                        errors.semesterErr !== ""
                        &&
                        <p className="text-red-500">
                            {errors.semesterErr}
                        </p>
                    }
                </section>
                <section>
                    <label htmlFor="studentName" className="block mb-1">Faculty Name:</label>
                    <input type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                        required
                        placeholder='Enter Faculty Name'
                    />
                </section>
                <section>
                    <label htmlFor="course">Course:</label>
                    <Dropdown
                        dataArr={coursesArr}
                        selected={formData.course}
                        setSelected={changeCourse}
                        name={"course"}
                        label={"Select Course"}
                    />
                    {
                        errors.courseErr !== ""
                        &&
                        <p className="text-red-500">
                            {errors.courseErr}
                        </p>
                    }
                </section>
                <section>
                    <label htmlFor="phno" className="block mb-1">Phone Number:</label>
                    <input type="text"
                        id="phno"
                        name="phno"
                        value={formData.phno}
                        onChange={handleChange}
                        className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                        required
                        placeholder='Enter Phone Number'
                        onKeyDown={handleNumericInput}
                    />
                    {
                        errors.phnoErr !== ""
                        &&
                        <p className="text-red-500">
                            {errors.phnoErr}
                        </p>
                    }
                </section>
                <section>
                    <label htmlFor="email" className="block mb-1">Email:</label>
                    <input type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                        required
                        placeholder='Enter Your Email'
                    />
                </section>

            </section>
            {/* <section className='flex items-center justify-center'>
                <section className="flex items-center justify-center md:w-[50%] ">
                    <label
                        htmlFor="dropzone-profilePic"
                        className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <section className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUploadIcon className="h-7 w-7" />
                            <p className=" text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to Upload</span> or Drag and Drop Faculty's Photo
                            </p>
                        </section>
                        <section className="mt-2">
                            {formData.profilePic !== null ? (
                                <>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Selected File: {formData.profilePic?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Selected File Size : {formatFileSize(formData.profilePic?.size || 0)}
                                    </p>
                                </>
                            ) : null}
                        </section>
                        <input
                            type="file"
                            id="dropzone-profilePic"
                            name="profilPic"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setFormData((old) => ({ ...old, profilePic: file }))
                            }}
                            accept="image/*"
                            required
                        />
                    </label>
                </section>
            </section> */}
            <section className="flex justify-center mt-4">
                <button type="submit" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500'>Update Faculty</button>
            </section>
        </form>
        </Modal>
        </>

    )
}
