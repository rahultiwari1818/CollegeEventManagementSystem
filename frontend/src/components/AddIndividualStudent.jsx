import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Dropdown from './Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../store/CourseSlice';
import { formatFileSize, handleNumericInput, isValidEmail, isValidName, isValidPassword, transformCourseData } from '../utils';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
import DatePicker from 'react-datepicker';
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";
import axios from 'axios';
import { toast } from 'react-toastify';
import Overlay from './Overlay';

export default function AddIndividualStudent() {


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const initialFormData = {
        course: '',
        semester: '',
        division: '',
        rollno: '',
        sid: '',
        studentName: '',
        phno: '',
        gender: '',
        dob: new Date().setDate(new Date().getDate() - 1),
        password: '',
        profilePic: null,
        email: ""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
        genderErr: "",
        courseErr: "",
        semesterErr: "",
        phnoErr: "",
        passwordErr: "",
        emailErr:"",
        nameErr:"",
    })
    const [isLoading,setIsLoading] = useState(false);
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

    const changeSemesters = useCallback((value) => {
        setFormData((old) => ({
            ...old, semester: value
        }))
    }, []);

    const isValidData = () => {
        let result = true;

        if(!isValidName(formData.studentName)){
            result = false;
            setErrors((old) => ({ ...old, nameErr: "Enter Valid Name" }))

        }
        else{
            setErrors((old) => ({ ...old, nameErr: "" }))

        }

        if (formData.course === "") {
            result = false;
            setErrors((old) => ({ ...old, courseErr: "Select a Course" }))
        }
        else {
            setErrors((old) => ({ ...old, courseErr: "" }))
        }
        if (formData.semester === "") {
            result = false;
            setErrors((old) => ({ ...old, semesterErr: "Select a Semester" }))
        }
        else {
            setErrors((old) => ({ ...old, semesterErr: "" }))
        }
        if (formData.gender === "") {
            result = false;
            setErrors((old) => ({ ...old, genderErr: "Select a Gender" }))
        }
        else {
            setErrors((old) => ({ ...old, genderErr: "" }))
        }
        if (formData.phno.length !== 10) {
            result = false;
            setErrors((old) => ({ ...old, phnoErr: "Phone Number Should Have Exactly 10 Digits" }))
        }
        else {
            setErrors((old) => ({ ...old, phnoErr: "" }))
        }

        if (!isValidPassword(formData.password)) {
            result = false;
            setErrors((old) => ({
                ...old, passwordErr: `Password Should Have at least 1 UpperCase Letter , 1 LowerCase Letter , 1 Digit and 1 Special Character.
            its length should be greater than 8`}))
        }
        else {
            setErrors((old) => ({ ...old, passwordErr: "" }))
        }
        if(!isValidEmail(formData.email)){
            result = false;
            setErrors((old) => ({ ...old, emailErr: "Enter a valid Email" }))
        }
        else{
            setErrors((old) => ({ ...old, emailErr: "" }))
        }

        return result;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!isValidData()) return;
        console.log(formData)
        // return;
        try {

            setIsLoading(true)

            const dataToPost = new FormData();
            dataToPost.append('course', formData.course);
            dataToPost.append('semester', formData.semester);
            dataToPost.append('division', formData.division);
            dataToPost.append('rollno', formData.rollno);
            dataToPost.append('sid', formData.sid);
            dataToPost.append('studentName', formData.studentName);
            dataToPost.append('phno', formData.phno);
            dataToPost.append('gender', formData.gender);
            dataToPost.append('dob', formData.dob);
            dataToPost.append('password', formData.password);
            dataToPost.append('profilePic', formData.profilePic);
            dataToPost.append('email', formData.email);

            const {data} = await axios.post(`${API_URL}/api/students/registerIndividual`, formData, {
                headers: {
                    "auth-token": token,
                    "Content-Type":"multipart/form-data"
                }
            })
                if (data.result) {
                toast.success(data.message);
                setFormData(initialFormData)
            }
            else {
                toast.error(data.message)

            }

        } catch (error) {
            console.log(error?.response?.data?.message)
            toast.error(error?.response?.data?.message)
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

    const semestersArr = useMemo(() => {
        for (let course of coursesData) {
            if (course._id === formData.course) {
                let semesters = [];
                for (let i = 1; i <= course.noOfSemesters; i++) {
                    semesters.push({ name: i });
                }
                console.log(semesters)
                return semesters;
            }
        }
        return [];
    }, [formData.course, coursesData])

    return (
        <>
        {

            isLoading &&
            <Overlay/>
        }
            <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg mx-4 my-3">
                <section className="grid md:grid-cols-2 grid-col-1 gap-4 my-3">
                    <section>
                        <label htmlFor="studentName" className="block mb-1">Student Name:</label>
                        <input type="text"
                            id="studentName"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                            required
                            placeholder='Enter Student Name'
                        />
                        {
                            errors.nameErr !== ""
                            &&
                            <p className="text-red-500">
                                {
                                    errors.nameErr
                                }
                            </p>
                        }
                    </section>
                    <section>
                        <label htmlFor="course">Course:</label>
                        <Dropdown
                            dataArr={coursesArr}
                            selected={formData.course}
                            setSelected={changeCourse}
                            name={"course"}
                            label={"Select Course"}
                            passedId={true}
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
                            selected={formData.semester}
                            setSelected={changeSemesters}
                            name={"semester"}
                            label={"Select Semester"}
                            disabled={formData.course === ""}
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
                            value={formData.division}
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
                            value={formData.rollno}
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
                            value={formData.sid}
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
                        {
                            errors.emailErr !== ""
                            &&
                            <p className="text-red-500">
                                {errors.emailErr}
                            </p>
                        }
                    </section>
                    <section>
                        <label htmlFor="gender" className="block mb-1">Gender:</label>
                        <section className="flex items-center w-full shadow-lg rounded-lg px-3 py-2">
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor="male">Male</label>
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={handleChange}
                                className="ml-4 mr-2"
                            />
                            <label htmlFor="female">Female</label>
                            <input
                                type="radio"
                                id="other"
                                name="gender"
                                value="other"
                                checked={formData.gender === 'other'}
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
                            selected={formData.dob}
                            onChange={(date) => {
                                setFormData({ ...formData, dob: date })
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
                    <section>
                        <label htmlFor="password" className="block mb-1">Password:</label>
                        <input type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                            placeholder='Enter Default Password '
                            required />

                        {
                            errors.passwordErr !== ""
                            &&
                            <p className="text-red-500">
                                {errors.passwordErr}
                            </p>
                        }
                    </section>
                </section>
                <section className='flex items-center justify-center'>
                    <section className="flex items-center justify-center md:w-[50%] ">
                        <label
                            htmlFor="dropzone-profilePic"
                            className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileUploadIcon className="h-7 w-7" />
                                <p className=" text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to Upload</span> or Drag and Drop Student's Photo
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
                </section>
                <section className="flex justify-center mt-4">
                    <button type="submit" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500'>Add Student</button>
                </section>
            </form>
        </>
    );
};

