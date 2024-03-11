import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAllCourses } from '../store/CourseSlice';
import { handleNumericInput } from '../utils';
import Modal from './Modal';

export default function AddCourse() {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

    const closeConfirmationModal = () => {
        setIsOpenConfirmationModal(false);
    }

    const [data, setData] = useState({
        courseName: "",
        noOfSemesters: 0
    });

    const [errors, setErrors] = useState({
        courseNameErr: "",
        noOfSemestersErr: ""
    })


    const validateData = () => {
        let flag = true;
        if (data.noOfSemesters === 0) {
            setErrors((old) => ({ ...old, noOfSemestersErr: "No Of Semester Must Be Greater Than 0.!" }))
            flag = false;
        }
        else {
            setErrors((old) => ({ ...old, noOfSemestersErr: "" }))
        }
        if (data.courseName.trim().length === 0) {
            setErrors((old) => ({ ...old, courseNameErr: "Course Name Should Contain Alphabets and Spaces Only.!" }))
            flag = false;
        }
        else {
            setErrors((old) => ({ ...old, courseNameErr: "" }))
        }
        return flag;
    }

    const dispatch = useDispatch();

    const addCourseHandler = async () => {
        closeConfirmationModal();

        if (!validateData()) return;

        try {
            const response = await axios.post(
                `${API_URL}/api/course/addCourse`,
                data,
                {
                    headers: {
                        "auth-token": token
                    }
                }
            );
            if (response.data.result) {
                toast.success(response.data.message);
                dispatch(fetchAllCourses());
            } else {
                toast.error(response.data.message);
            }
            setData({
                courseName: "",
                noOfSemesters: 0
            });
        } catch ({response}) {
            toast.error(response?.data?.message);
        }
    };

    const updateData = (e) => {
        const { name, value } = e.target;
        setData((old) => ({ ...old, [name]: value }))
    }

    return (
        <>
            <section className='p-3 rounded-lg border border-blue-500 my-2'>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="ename">Add New Course:</label>
                    <input
                        type="text"
                        name="courseName"
                        value={data.courseName}
                        onChange={updateData}
                        placeholder='Enter Course Name'
                        className='w-full shadow-lg md:p-3 rounded-lg p-2 my-2'
                        required
                    />
                    {
                        errors.courseNameErr !== ""
                        &&
                        <p className="text-red-500 my-2">
                            {
                                errors.courseNameErr
                            }
                        </p>
                    }
                </section>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="ename">No of Semesters:</label>
                    <input
                        type="text"
                        name="noOfSemesters"
                        value={data.noOfSemesters}
                        onChange={updateData}
                        placeholder='Enter No Of Semesters'
                        className='w-full shadow-lg md:p-3 rounded-lg p-2 my-2'
                        onKeyDown={handleNumericInput}
                        required
                    />
                    {
                        errors.noOfSemestersErr !== ""
                        &&
                        <p className="text-red-500 my-2">
                            {
                                errors.noOfSemestersErr
                            }
                        </p>
                    }
                </section>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <button
                        className="text-white bg-red-500 px-5 py-3 rounded-lg shadow-lg hover:text-red-500 hover:bg-white hover:border-red-500 hover:border"
                        onClick={() => {
                            setIsOpenConfirmationModal(true);
                        }}
                    >
                        Add Course
                    </button>
                </section>
            </section>
            <ConfirmationModal isOpen={isOpenConfirmationModal} close={closeConfirmationModal} addCourseHandler={addCourseHandler} data={data} />
        </>

    )
}


const ConfirmationModal = ({ isOpen, close, addCourseHandler, data }) => {

    return (
        <Modal isOpen={isOpen} close={close} heading={"Adding Confirmation"}>
            <section className="py-2">
                <section>
                    <p className="text-center text-xl py-2 text-red-500">
                        This Action Can Not be Reverted ! <br />
                        Added Course Can Not Be Updated or Deleted <br />
                        Are You Sure To Add Course.?
                    </p>
                    <section className="my-3 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-7">
                        <p className='text-center'>
                            Course Name : {data.courseName}
                        </p>
                        <p className='text-center'>
                            No of Semesters : {data.noOfSemesters}
                        </p>
                    </section>
                    <section className="my-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <button
                            className='text-yellow-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-yellow-500 hover:text-white hover:bg-yellow-500 '

                            onClick={() => close()}
                        >Edit Data</button>
                        <button
                            className='text-red-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 '

                            onClick={() => {
                                addCourseHandler()
                            }}
                        >
                            Add Course
                        </button>
                    </section>
                </section>
            </section>
        </Modal>
    )

}