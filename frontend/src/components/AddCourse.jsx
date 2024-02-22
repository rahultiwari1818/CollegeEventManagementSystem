import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAllCourses } from '../store/CourseSlice';
import { handleNumericInput } from '../utils';

export default function AddCourse() {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [data, setData] = useState({
        courseName:"",
        noOfSemesters:0
    });
    const dispatch = useDispatch();

    const addCourseHandler = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/course/addCourse`,
                data ,
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
                courseName:"",
                noOfSemesters:0
            });
        } catch (error) {
            console.error("Error adding course:", error);
            toast.error("An error occurred while adding the course.");
        }
    };
    
    const updateData = (e) =>{
        const {name,value} = e.target;
        setData((old)=>({...old,[name]:value}))
    }

    return (
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
            </section>
            <section className='md:p-2 md:m-2 p-1 m-1'>
                <button
                    className="text-white bg-red-500 px-5 py-3 rounded-lg shadow-lg hover:text-red-500 hover:bg-white hover:border-red-500 hover:border"
                    onClick={addCourseHandler}
                >
                    Add Course
                </button>
            </section>
        </section>

    )
}
