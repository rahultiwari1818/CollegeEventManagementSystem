import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from "./Modal";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../store/CourseSlice';
import axios from 'axios';
import { ReactComponent as WhiteCloseIcon } from "../assets/Icons/WhiteCloseIcon.svg";
import FacultyCombobox from './FacultyCombobox';
import { debounce, isValidName } from '../utils';
import { toast } from 'react-toastify';
import Overlay from "./Overlay";

export default function UpdateEventType({ isOpen, close, dataToBeUpdated }) {


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [data, setData] = useState({ newEventTypeLogo: null });
    const [isLoading,setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        eventTypeNameErr: ""
    })

    const dispatch = useDispatch();
    const courseData = useSelector((state) => state.CourseSlice.data);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setErrors(() => (
            {
                eventTypeNameErr: ""
            }
        ))
        if (!dataToBeUpdated?._id) return;
        setData((old) => {
            const courseArray = courseData?.map((course) => {
                const faculties = [];
                for (let faculty of dataToBeUpdated.committeeMembers) {
                    if (faculty.course?._id === course._id) {
                        faculties.push(faculty);
                    }
                }

                return (
                    {
                        courseId: course._id,
                        faculties: faculties,
                    }
                )
            })

            return {
                eventTypeName: dataToBeUpdated.eventTypeName,
                _id: dataToBeUpdated._id,
                courseWiseFaculties: courseArray,
                eventTypeLogoPath: dataToBeUpdated.eventTypeLogoPath,
                eventTypeLogo: dataToBeUpdated.eventTypeLogo,
                newEventTypeLogo: null
            }
        })
    }, [dataToBeUpdated])

    useEffect(() => {
        if (courseData?.length === 0) {
            dispatch(fetchAllCourses());
        }
    }, [courseData]);

    const updateCourseWiseFacultiesData = useCallback((id, data) => {
        if (!id || !data) return;
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
            return {
                ...old,
                courseWiseFaculties: newFaculties
            }
        })
    }, []);

    const validateData = () => {
        let result = true;

        if (!isValidName(data.eventTypeName.trim())) {
            result = false;
            setErrors((old) => ({ ...old, eventTypeNameErr: "Event Type Name Should Only Have Alphabets and Spaces." }))
        }
        else {
            setErrors((old) => ({ ...old, eventTypeNameErr: "" }))
        }
        return result;
    }

    const updateEventHanler = async () => {

        try {

            if (!validateData()) {
                return;
            }
            setIsLoading(true);

            const courseWiseFaculties = [];
            data.courseWiseFaculties?.forEach((course) => {
                course.faculties.forEach((faculty) => {
                    courseWiseFaculties.push(faculty._id);
                })
            })

            // const formData = {
            //     id:dataToBeUpdated._id,
            //     eventTypeName:data.eventTypeName,
            //     courseWiseFaculties:JSON.stringify(courseWiseFaculties)
            // }

            const formData = new FormData();

            formData.append("id", dataToBeUpdated._id);
            formData.append("eventTypeName", data.eventTypeName);
            formData.append("courseWiseFaculties", JSON.stringify(courseWiseFaculties));
            formData.append("eventTypeLogoPath", data.eventTypeLogoPath);
            formData.append("eventTypeLogo", data.eventTypeLogo);
            formData.append("newEventTypeLogo",data.newEventTypeLogo)

            const response = await axios.patch(`${API_URL}/api/eventType/updateEventType`, formData, {
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
                        eventTypeName: "",
                        courseWiseFaculties: newFaculties
                    }
                })
                close();
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message);
        }
        finally {
            setIsLoading(false);
        }



    }




    return (
        <>
        {
            isLoading
            &&
            <Overlay/>
        }
        <Modal isOpen={isOpen} close={close} heading={"Update Event Type"}>
            <section className="py-2 px-2">
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="ename" className=' text-blue-500'> Event Type Name:</label>
                    <input
                        type="text"
                        name="eventTypeName"
                        value={data.eventTypeName}
                        onChange={(e) => {
                            setData((old) => ({ ...old, eventTypeName: e.target.value }))
                        }}
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
                    <section className="grid grid-cols-1 md:grid-cols-2   gap-5">
                        {
                            courseData?.map((course, idx) => {
                                return (
                                    <AddFacultiesInEventType key={course._id}
                                        course={course}
                                        idx={idx}
                                        updateCourseWiseFacultiesData={updateCourseWiseFacultiesData}
                                        existingCourseFaculties={data?.courseWiseFaculties?.find(specificCourse => specificCourse.courseId === course._id).faculties}
                                    />
                                )
                            })
                        }
                    </section>
                </section>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                        <p className='text-blue-500'>Current Event Type Logo : </p>
                        <img src={data.eventTypeLogoPath} alt="event type" className='px-2 py-3 border border-blue-500' />
                        {data.newEventTypeLogo && (
                            <p className="mb-2">
                                Filename: {data.newEventTypeLogo.name}, Size: {data.newEventTypeLogo.size} bytes
                            </p>
                        )}
                        <input
                            type="file"
                            name="newEventTypeLogo"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e)=>{
                                const file = e.target.files[0];
                                setData((old)=>({...old,newEventTypeLogo:file}))
                            }}
                        />
                                <button
                                    className="px-5 py-2 my-3 shadow-lg rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500  text-white  focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    onClick={()=>{
                                        fileInputRef.current.click();

                                    }}
                                >
                                    Change Logo
                                </button>
                         
                </section>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <button
                        className='text-red-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 '
                        onClick={updateEventHanler}
                    >
                        Update Event Type
                    </button>
                </section>

            </section>
        </Modal>
        </>
    )
}


const AddFacultiesInEventType = ({ course, idx, updateCourseWiseFacultiesData, setBackFlag, existingCourseFaculties }) => {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [facultyData, setFacultyData] = useState(existingCourseFaculties || []);

    useEffect(() => {
        // Update facultyData directly when existingCourseFaculties changes
        if (existingCourseFaculties) {
            setFacultyData(existingCourseFaculties);
            // Call updateCourseWiseFacultiesData immediately
            updateCourseWiseFacultiesData(course._id, existingCourseFaculties);
        }
    }, [course._id, existingCourseFaculties, updateCourseWiseFacultiesData]);



    useEffect(() => {
        // Call updateCourseWiseFacultiesData whenever facultyData changes
        updateCourseWiseFacultiesData(course._id, facultyData);
    }, [course._id, facultyData, updateCourseWiseFacultiesData]);

    useEffect(() => {
        // Reset facultyData when setBackFlag changes
        if (setBackFlag) {
            setFacultyData([]);
        }
    }, [setBackFlag]);

    // const [facultyData, setFacultyData] = useState([]);
    // useEffect(() => {
    //     setFacultyData((old) => existingCourseFaculties);
    // }, [existingCourseFaculties]);

    // useEffect(() => {
    //     updateCourseWiseFacultiesData(course._id, facultyData);
    // }, [facultyData]);


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


    const removeFaculty = (facultyId) => {
        setFacultyData((oldFaculties) => {
            return oldFaculties.filter((faculty => faculty._id !== facultyId));
        })
    }

    // useEffect(() => {
    //     setFacultyData((old) => []);
    // }, [setBackFlag])

    return (
        <>
            <section
                className='border border-blue-500 rounded-lg px-2 py-2 shadow-lg'
            >
                <section className="border border-blue-500 px-3 py-2 text-blue-500 text-center">
                    {
                        course?.courseName
                    }
                </section>
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
                                    <section className="flex justify-between item-center gap-3 my-2 mx-2 text-blue-500  py-2 px-2 border border-blue-500" key={faculty._id}>
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
                            <section className="flex justify-between item-center gap-3 my-2 mx-2 text-blue-500  py-2 px-2 border border-blue-500">
                                <p className="text-center">
                                    No Faculties Added.
                                </p>
                            </section>
                    }
                </section>

            </section>
        </>
    )

}