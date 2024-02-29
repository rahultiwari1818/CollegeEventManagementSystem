import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { formatFileSize, handleNumericInput, isValidPassword, transformCourseData } from '../utils';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from './Dropdown';
import { fetchAllCourses } from '../store/CourseSlice';
import axios from 'axios';
import {toast} from "react-toastify"
import Overlay from './Overlay';
export default function UpdateStudent({ isOpen, close, heading, dataToBeUpdated = {},updateStateData }) {


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [data, setData] = useState(dataToBeUpdated)
    const [errors, setErrors] = useState({
        genderErr: "",
        courseErr: "",
        semesterErr: "",
        phnoErr: "",
        passwordErr: ""
    })
    const coursesData = useSelector((state) => state.CourseSlice.data);
    const dispatch = useDispatch();
    const [isLoading,setIsLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const changeCourse = useCallback((value) => {
        setData((old) => ({
            ...old, course: value
        }))
    }, [])

    const changeSemesters = useCallback((value) => {
        setData((old) => ({
            ...old, semester: value
        }))
    }, []);

    const isValidData = () => {
        let result = true;

        if (data.course === "") {
            result = false;
            setErrors((old) => ({ ...old, courseErr: "Select a Course" }))
        }
        else {
            setErrors((old) => ({ ...old, courseErr: "" }))
        }
        if (data.semester === "") {
            result = false;
            setErrors((old) => ({ ...old, semesterErr: "Select a Semester" }))
        }
        else {
            setErrors((old) => ({ ...old, semesterErr: "" }))
        }
        if (data.gender === "") {
            result = false;
            setErrors((old) => ({ ...old, genderErr: "Select a Gender" }))
        }
        else {
            setErrors((old) => ({ ...old, genderErr: "" }))
        }
        if (data.phno.length !== 10) {
            result = false;
            setErrors((old) => ({ ...old, phnoErr: "Phone Number Should Have Exactly 10 Digits" }))
        }
        else {
            setErrors((old) => ({ ...old, phnoErr: "" }))
        }

        
        return result;
    }


    const updateDataHandler = async(e)=>{
        e.preventDefault();

        if(!isValidData()) return;

        try {
            
            setIsLoading(true);

            const response = await axios.post(`${API_URL}/api/students/updateStudentData`,data,{
                headers:{
                    "auth-token":token
                }
            })
            
            if(response.data.result){
                toast.success(response.data.message);
                updateStateData(response.data.updatedStudent);
                close()
            }

        } catch ({response}) {

            toast.error(response.data.message)
        }
        finally{
            setIsLoading(false);
        }

        
    }


    useEffect(() => {
        dispatch(fetchAllCourses());
    }, [dispatch])

    useEffect(()=>{
        setData((old)=>dataToBeUpdated)
    },[dataToBeUpdated])

    const coursesArr = useMemo(() => {
        return transformCourseData(coursesData, false);
    }, [coursesData])

    const semestersArr = useMemo(() => {
        for (let course of coursesData) {
            if (course.courseName === data.course) {
                let semesters = [];
                for (let i = 1; i <= course.noOfSemesters; i++) {
                    semesters.push({ name: i });
                }
                console.log(semesters)
                return semesters;
            }
        }
        return [];
    }, [data.course, coursesData])

    console.log(data,"data")

    return (
        <>
        {
        isLoading
        &&
        <Overlay/>
        }
        <Modal isOpen={isOpen} close={close} heading={heading}>
            <form  method="post" onSubmit={updateDataHandler}>
                <section>
                    <section className="grid md:grid-cols-2 grid-col-1 gap-4 my-3">

                        <section>
                            <label htmlFor="studentName" className="block mb-1">Student Name:</label>
                            <input type="text"
                                id="studentName"
                                name="studentName"
                                value={data.studentName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                                required
                                placeholder='Enter Student Name'
                            />
                        </section>
                        <section>
                            <label htmlFor="course">Course:</label>
                            <Dropdown
                                dataArr={coursesArr}
                                selected={data.course}
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
                            <label htmlFor="semester" className="block mb-1">Semester:</label>
                            <Dropdown
                                dataArr={semestersArr}
                                selected={data.semester}
                                setSelected={changeSemesters}
                                name={"semester"}
                                label={"Select Semester"}
                                disabled={data.course === ""}
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
                            <label htmlFor="division" className="block mb-1">Division:</label>
                            <input type="text"
                                id="division"
                                name="division"
                                value={data.division}
                                onChange={handleChange}
                                className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                                required
                                placeholder='Enter Division'
                                onKeyDown={handleNumericInput}
                            />
                        </section>
                        <section>
                            <label htmlFor="rollno" className="block mb-1">Roll No:</label>
                            <input type="text"
                                id="rollno"
                                name="rollno"
                                value={data.rollno}
                                onChange={handleChange}
                                className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                                required
                                placeholder='Enter Roll NO'
                                onKeyDown={handleNumericInput}
                            />
                        </section>
                        <section>
                            <label htmlFor="sid" className="block mb-1">SID:</label>
                            <input type="text"
                                id="sid"
                                name="sid"
                                value={data.sid}
                                onChange={handleChange}
                                className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                                required
                                placeholder='Enter SID'
                                onKeyDown={handleNumericInput}
                            />
                        </section>
                        <section>
                            <label htmlFor="phno" className="block mb-1">Phone Number:</label>
                            <input type="text"
                                id="phno"
                                name="phno"
                                value={data.phno}
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
                                value={data.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                                required
                                placeholder='Enter Your Email'
                            />
                        </section>
                        <section>
                            <label htmlFor="gender" className="block mb-1">Gender:</label>
                            <section className="flex items-center w-full shadow-lg rounded-lg px-3 py-2">
                                <input
                                    type="radio"
                                    id="male"
                                    name="gender"
                                    value="male"
                                    checked={data.gender?.toLowerCase() === 'male' }
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label htmlFor="male">Male</label>
                                <input
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    value="female"
                                    checked={data.gender?.toLowerCase() === 'female'}
                                    onChange={handleChange}
                                    className="ml-4 mr-2"
                                />
                                <label htmlFor="female">Female</label>
                                <input
                                    type="radio"
                                    id="other"
                                    name="gender"
                                    value="other"
                                    checked={data.gender?.toLowerCase() === 'other'}
                                    onChange={handleChange}
                                    className="ml-4"
                                />
                                <label htmlFor="other">Other</label>
                            </section>
                            {
                                errors.genderErr !== ""
                                &&
                                <p className="text-red-500">
                                    {errors.genderErr}
                                </p>
                            }
                        </section>
                        <section>
                            <label htmlFor="dob" className="block mb-1">Date of Birth:</label>
                            <DatePicker
                                name='dob'
                                selected={new Date(data.dob||Date.now())}
                                onChange={(date) => {
                                    setData({ ...data, dob: date })
                                }
                                }
                                dateFormat="dd-MM-yyyy"
                                maxDate={new Date().setDate(new Date().getDate() - 1)}
                                className="w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1 "
                                showIcon
                                icon={
                                    <section className="m-2">
                                        <CalanderIcon />
                                    </section>
                                }
                            />
                        </section>
                    </section>
                    <button type="submit"
                    className='text-red-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 '
                    >
                        Update Data
                    </button>
                </section>
            </form>
        </Modal>
        </>
    )
}
