import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function AddCourse() {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [data, setData] = useState("");

    const addCourseHandler = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/course/addCourse`,
                { courseName: data },
                {
                    headers: {
                        "auth-token": token
                    }
                }
            );
            if (response.data.result) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            setData("");
        } catch (error) {
            console.error("Error adding course:", error);
            toast.error("An error occurred while adding the course.");
        }
    };
    
    return (
        <section className='p-3 rounded-lg border border-blue-500 my-2'>
            <section className='md:p-2 md:m-2 p-1 m-1'>
                <label htmlFor="ename">Add New Course:</label>
                <input
                    type="text"
                    name="canme"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder='Enter Course Name'
                    className='w-full shadow-lg md:p-3 rounded-lg p-2 my-2'
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
