import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Dropdown from './Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../store/CourseSlice';
import { transformCourseData } from '../utils';

export default function AddInsectionidualStudent() {
    const [formData, setFormData] = useState({
        course: '',
        semester: '',
        sectionision: '',
        rollno: '',
        sid: '',
        studentName: '',
        phno: '',
        gender: '',
        dob: '',
        password: ''
    });

    const coursesData = useSelector((state)=>state.CourseSlice.data);
    const dispatch = useDispatch();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const changeCourse = useCallback((value)=>{
        setFormData((old)=>({
            ...old,course:value
        }))
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formData);
    };

    useEffect(()=>{
        dispatch(fetchAllCourses());
    },[dispatch])

    const coursesArr = useMemo(()=>{
        return transformCourseData(coursesData);
    },[coursesData])


    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg mx-4 my-3">
            <section className="grid md:grid-cols-2 grid-col-1 gap-4">
                <section>
                    <label htmlFor="course">Course:</label>
                    <Dropdown
                        dataArr={coursesArr}
                        selected={formData.course}
                        setSelected={changeCourse}
                        name={"course"}
                        label={"Select Course"}
                    />
                </section>
                <section>
                    <label htmlFor="semester" className="block mb-1">Semester:</label>
                    <input type="text" id="semester" name="semester" value={formData.semester} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="sectionision" className="block mb-1">sectionision:</label>
                    <input type="text" id="sectionision" name="sectionision" value={formData.sectionision} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="rollno" className="block mb-1">Roll No:</label>
                    <input type="text" id="rollno" name="rollno" value={formData.rollno} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="sid" className="block mb-1">SID:</label>
                    <input type="text" id="sid" name="sid" value={formData.sid} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="studentName" className="block mb-1">Student Name:</label>
                    <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="phno" className="block mb-1">Phone Number:</label>
                    <input type="text" id="phno" name="phno" value={formData.phno} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="gender" className="block mb-1">Gender:</label>
                    <input type="text" id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="dob" className="block mb-1">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
                <section>
                    <label htmlFor="password" className="block mb-1">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </section>
            </section>
            <section className="flex justify-center mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Submit</button>
            </section>
        </form>
    );
};

