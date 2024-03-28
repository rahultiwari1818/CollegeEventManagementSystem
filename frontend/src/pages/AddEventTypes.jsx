import React, { useCallback, useEffect, useState } from 'react'
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";
import { ReactComponent as WhiteCloseIcon } from "../assets/Icons/WhiteCloseIcon.svg";
import { debounce, formatFileSize, isValidName } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchAllEventTypes } from '../store/EventTypeSlice';
import { useDispatch, useSelector } from 'react-redux';
import FacultyCombobox from '../components/FacultyCombobox';
import { fetchAllCourses } from '../store/CourseSlice';
import Overlay from '../components/Overlay';
import { useNavigate } from 'react-router-dom';

export default function AddEventType() {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [backToInitialState, setBackToInitialState] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const [data, setData] = useState({
        eventTypeName: "",
        eventTypeLogo: null,
        courseWiseFaculties: []
    });
    const [errors, setErrors] = useState({
        eventTypeNameErr: "",
        eventTypeLogoErr: ""
    });

    const dispatch = useDispatch();
    const courseData = useSelector((state) => state.CourseSlice.data);

    const updateData = (e) => {
        const { name, value } = e.target;
        setData((old) => ({ ...old, [name]: value }))
    }


    const validateData = () => {
        let result = true;

        if (!isValidName(data.eventTypeName.trim())) {
            result = false;
            setErrors((old) => ({ ...old, eventTypeNameErr: "Event Type Name Should Only Have Alphabets and Spaces." }))
        }
        else {
            setErrors((old) => ({ ...old, eventTypeNameErr: "" }))
        }

        if (data.eventTypeLogo === null) {

            result = false;
            setErrors((old) => ({ ...old, eventTypeLogoErr: "Select a Logo For Event Type" }))
        }
        else {
            setErrors((old) => ({ ...old, eventTypeLogoErr: "" }))
        }

        return result;
    }

    const addEventTypeHandler = async () => {

        try {
            if (!validateData()) {
                return;
            }
            setShowOverlay(true);

            const courseWiseFaculties = [];
            data.courseWiseFaculties?.forEach((course) => {
                course.faculties.forEach((faculty) => {
                    courseWiseFaculties.push(faculty._id);
                })
            })

            const formData = new FormData();
            formData.append("eventTypeName", data.eventTypeName);
            formData.append("eventTypeLogo", data.eventTypeLogo);
            formData.append("courseWiseFaculties", JSON.stringify(courseWiseFaculties))

            const response = await axios.post(`${API_URL}/api/eventType/addEventType`, formData, {
                headers: {
                    "auth-token": token,
                    "Content-Type": "multipart/form-data"
                }
            })
            if (response.data.result) {
                toast.success(response.data.message);
                setData((old) => {
                    const oldFaculties = old.courseWiseFaculties;
                    const newFaculties = oldFaculties.map((faculty) => (
                        {
                            courseId: faculty.courseId,
                            faculty: []
                        }
                    ))
                    return {
                        eventTypeLogo: null,
                        eventTypeName: "",
                        courseWiseFaculties: newFaculties
                    }
                })
                setBackToInitialState((old) => !old);
            }
            else {
                toast.error(response.data.message)
            }


        } catch ({ response }) {
            toast.error(response.data.message)
        }
        finally {
            setShowOverlay(false);
        }



    }

    const updateCourseWiseFacultiesData = useCallback((id, data) => {
        setData((old) => {
            const oldFaculties = old?.courseWiseFaculties;
            const newFaculties = oldFaculties?.map((course) => {
                if (course.courseId === id) {
                    return {
                        courseId: id,
                        faculties: data
                    }
                }
                else {
                    return course
                }
            })
            // console.log(oldFaculties, newFaculties, id, data, "fac")
            return {
                ...old,
                courseWiseFaculties: newFaculties
            }
        })
    }, [])


    useEffect(() => {
        if (courseData?.length === 0) {
            dispatch(fetchAllCourses());
        }
        else {
            setData((old) => {
                const courseArray = courseData?.map((course) => {
                    return (
                        {
                            courseId: course._id,
                            faculties: [],
                        }
                    )
                })
                return {
                    ...old,
                    courseWiseFaculties: courseArray
                }
            })
        }
    }, [courseData]);


    const user = useSelector((state) => state.UserSlice);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user?.role === "" || user?.role === undefined) return;
        if (user.role !== "Super Admin") {
            navigate("/home");
        }
        // console.log("called")
        setShowOverlay(false)
    }, [user, navigate])

    return (
        <>
            {
                showOverlay
                &&
                <Overlay />
            }
            <secction className="flex justify-center items-center px-5 py-5">
                <section className='p-3 rounded-lg border border-blue-500 my-2 shadow-lg'>
                    <p className="text-center text-xl border-b bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2">
                        Add New Event Type and Committee Members
                    </p>
                    <section className='md:p-2 md:m-2 p-1 m-1'>
                        <label htmlFor="ename" className=' text-blue-500'> Event Type Name:</label>
                        <input
                            type="text"
                            name="eventTypeName"
                            value={data.eventTypeName}
                            onChange={updateData}
                            placeholder='Enter Event Type Name'
                            className='w-full shadow-lg md:p-3 rounded-lg p-2 my-2'
                            required
                        />
                        {
                            errors.eventTypeNameErr !== ""
                            &&
                            <p className="text-red-500 my-2">
                                {
                                    errors.eventTypeNameErr
                                }
                            </p>
                        }
                    </section>


                    <section className='md:p-2 md:m-2 p-1 m-1'>
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5">
                            {
                                courseData?.map((course, idx) => {
                                    return (
                                        <AddFacultiesInEventType key={course._id}
                                            course={course}
                                            idx={idx}
                                            updateCourseWiseFacultiesData={updateCourseWiseFacultiesData}
                                            setBackFlag={backToInitialState}
                                        />
                                    )
                                })
                            }
                        </section>
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
                                            setErrors((old) => ({ ...old, eventTypeLogoErr: "Logo Size Should be less than 10 Mb." }));
                                            setData({ ...data, eventTypeLogo: null });
                                        }
                                        else {
                                            setData({ ...data, eventTypeLogo: file });
                                            setErrors((old) => ({ ...old, eventTypeLogoErr: "" }));
                                        }
                                    }}

                                    required
                                />
                                {
                                    errors.eventTypeLogoErr !== ""
                                    &&
                                    <p className="text-red-500 my-2">
                                        {
                                            errors.eventTypeLogoErr
                                        }
                                    </p>
                                }
                            </label>

                        </section>
                    </section>

                    <section className='md:p-2 md:m-2 p-1 m-1'>
                        <button
                            className="text-white w-full block bg-red-500 px-5 py-3 rounded-lg shadow-lg hover:text-red-500 hover:bg-white hover:border-red-500 hover:border"
                            onClick={addEventTypeHandler}
                        >
                            Add Event Type
                        </button>
                    </section>
                </section>
            </secction>
        </>

    )
}


const AddFacultiesInEventType = ({ course, idx, updateCourseWiseFacultiesData, setBackFlag }) => {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [facultyData, setFacultyData] = useState([]);

    const [searchedFaculty, setSearchedFaculty] = useState([]);

    const fetchFacultyData = async (searchQuery) => {

        try {
            const { data } = await axios.get(`${API_URL}/api/faculties/getFaculties`, {
                params: {
                    course: course._id,
                    search: searchQuery
                },
                headers: {
                    "auth-token": token
                }
            });

            if (data?.result) {
                setSearchedFaculty(data?.data);
            }
        } catch (error) {
            setSearchedFaculty([])
        }

    }

    const ddebouncedFetchedFacultyData = useCallback(debounce(fetchFacultyData, 800), []);

    const updateSelectedFaculty = useCallback((data) => {
        setFacultyData((oldFaculties) => {
            for (let faculty of oldFaculties) {
                if (faculty._id === data._id) {
                    return oldFaculties;
                }
            }
            return [...oldFaculties, data];
        })
    }, [])

    useEffect(() => {
        updateCourseWiseFacultiesData(course._id, facultyData)
    }, [facultyData])

    const removeFaculty = (facultyId) => {
        setFacultyData((oldFaculties) => {
            return oldFaculties.filter((faculty => faculty._id !== facultyId));
        })
    }

    useEffect(() => {
        setFacultyData((old) => []);
    }, [setBackFlag])

    return (
        <>
            <section
                className='border border-blue-500 rounded-lg  shadow-lg'
            >
                <section className="border-b rounded-t-lg border-blue-500 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center">
                    {
                        course?.courseName
                    }
                </section>
                <section className="px-2">
                    <section className="my-2">

                        <FacultyCombobox
                            placeholder={"Add Faculty by Email"}
                            peopleData={searchedFaculty}
                            searchFaculty={ddebouncedFetchedFacultyData}
                            updateSelectedFaculty={updateSelectedFaculty}
                        />
                    </section>
                    <section className="my-2 border border-blue-500">
                        {
                            facultyData.length > 0
                                ?
                                facultyData?.map((faculty, idx) => {
                                    return (
                                        <section className="flex justify-between item-center gap-3 my-2 mx-2 text-blue-500  py-2 px-2 border-b border-blue-500" key={faculty._id}>
                                            <p className=' '>
                                                {
                                                    faculty.name
                                                }
                                            </p>
                                            <button className='bg-red-500 rounded-full px-2 py-2  text-white'
                                                onClick={() => removeFaculty(faculty._id)}
                                            >
                                                <WhiteCloseIcon />
                                            </button>
                                        </section>

                                    )
                                })
                                :
                                <section className="flex justify-between item-center gap-3 my-2 mx-2 text-blue-500  py-2 px-2 ">
                                    <p className="text-center">
                                        No Faculties Added.
                                    </p>
                                </section>
                        }
                    </section>
                </section>

            </section>
        </>
    )

}