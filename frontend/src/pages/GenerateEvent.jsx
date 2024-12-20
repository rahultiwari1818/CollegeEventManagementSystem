import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Dropdown from '../components/Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";
import { ReactComponent as AddIcon } from "../assets/Icons/add_icon.svg";
import { ReactComponent as EditIcon } from "../assets/Icons/edit_icon.svg";
import { ReactComponent as DeleteIcon } from "../assets/Icons/DeleteIcon.svg";
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatFileSize, handleNumericInput, transformEventTypesData } from '../utils';
import ToggleSwitch from '../components/ToggleSwitch';
import AddSubEvents from '../components/AddSubEvents';
import Overlay from "../components/Overlay";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../store/CourseSlice';
import { useNavigate } from 'react-router-dom';

export default function GenerateEvent() {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const initialState = {
        ename: "",
        etype: "",
        ptype: "",
        enature: "",
        noOfParticipants: 1,
        edate: new Date(new Date().setDate(new Date().getDate() + 1)),
        rcdate: new Date(),
        rules: "",
        edetails: "",
        ebrochure: null,
        eposter: null,
        hasSubEvents: false,
        subEvents: [],
        eligibleCourses: [],
        courseWiseResult:false,
        eligibleSemester:[],
    }

    const [data, setData] = useState(initialState);

    const initialErrorState = {
        edateErr: "",
        rcdateErr: "",
        etypeErr: "",
        ptypeErr: "",
        enatureErr: "",
        eligibleCoursesErr:"",
        eligibleSemesterErr:""
    };

    const [errors, setErrors] = useState(initialErrorState)

    const [subEventDataToUpdate, setSubEventDataToUpdate] = useState({});

    const noOfParticipants = useRef(null);

    const [isLoading, setIsLoading] = useState(true);

    const [fileErrors, setFileErrors] = useState({
        posterError: "",
        brochureError: ""
    })

    const [eventNatures,setEventNatures] = useState([]);

    const coursesData = useSelector((state) => state.CourseSlice.data);
    const dispatch = useDispatch();

    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({ ...data, [name]: value });
    }
    const updateHasSubEvents = useCallback((value) => {
        setData(prevData => ({
            ...prevData,
            hasSubEvents: value
        }));
    }, []);

    const updateCourseWiseResult = useCallback((value)=>{
        setData(prevData => ({
            ...prevData,
            courseWiseResult: value
        }));
    },[]);

    const removeSubEvent = (id) => {
        const filteredSubEvents = data?.subEvents?.filter((event) => event.sId !== id);
        setData({
            ...data,
            subEvents: filteredSubEvents
        })
    }

    const updateAddSubEvent = (id) => {
        const subEventData = data?.subEvents?.filter((event) => event.sId === id);

        setSubEventDataToUpdate(() => subEventData[0]);
        setOpenAddSubEventModal((old) => !old)
    }

    const changeEventNature = useCallback((value) => {
        
        setData((old) => ({ ...old, enature: value }))
    }, [setData]);




    const changeParticipationType = useCallback((value) => {
        setData((old) => ({ ...old, ptype: value }))

        if (value === 'Individual') {

            setData((old) => ({ ...old, ptype: value ,noOfParticipants:1}));


            noOfParticipants.current.disabled = true;
        } else if (value === 'Group') {
            noOfParticipants.current.disabled = false;
            setData((old) => ({ ...old, ptype: value ,noOfParticipants:2}));
        }
        //   console.log(value,noOfParticipants.current,"participant")
    }, [setData]);

    const changeEventType = useCallback((value) => {
        setData((old) => ({ ...old, etype: value }))
    }, [setData]);


    const handleCourseChange = (courseName) => {
        const newSelectedCourses = data.eligibleCourses.includes(courseName)
            ? data.eligibleCourses.filter((name) => name !== courseName)
            : [...data.eligibleCourses, courseName];
        setData((old) => ({ ...old, eligibleCourses: newSelectedCourses }));
    };

    const handleSemesterChange = (value)=>{
        const newSelectedSemesters = data.eligibleSemester.includes(value)
        ?   data.eligibleSemester.filter((sem)=>sem !== value)
        :[...data.eligibleSemester,value];
        setData((old)=>({...old,eligibleSemester:newSelectedSemesters}));
    }

    const [openAddSubEventModal, setOpenAddSubEventModal] = useState(false);


    const validateData = () => {
        let isValidated = true;
        if (data.etype === "") {
            setErrors((old) => ({ ...old, etypeErr: "Event Type is Required" }));
            isValidated = false;
        }
        else{
            setErrors((old) => ({ ...old, etypeErr: "" }));
        }
        if (data.ptype === "" && !data.hasSubEvents) {
            setErrors((old) => ({ ...old, ptypeErr: "Participation Type is Required" }));
            isValidated = false;
        }
        else{
            setErrors((old) => ({ ...old, ptypeErr: "" }));
        }
        if (data.enature === "") {
            setErrors((old) => ({ ...old, enatureErr: "Event Nature is Required" }));
            isValidated = false;

        }else{
            setErrors((old) => ({ ...old, enatureErr: "" }));
        }
        const enature = eventNatures.find(e=>e._id===data.enature) || null;
        if(enature){
            // console.log(user._id,enature)
            if (!enature.committeeMembers.includes(user._id) && user.role !== "Super Admin") {
                setErrors((old) => ({ ...old, enatureErr: `You Can Not Generate  ${enature.name} Events as You are Not The Member of This Committe.!` }));
                isValidated = false;
    
            }else{
                setErrors((old) => ({ ...old, enatureErr: "" }));
            }
        }
        
        if(!data.hasSubEvents && data.eligibleSemester.length===0){
            isValidated=false;
            setErrors((old)=>({...old,eligibleSemesterErr:"Select Eligible Semesters.!"}));
        }
        else{
            setErrors((old)=>({...old,eligibleSemesterErr:""}));
        }


        if (data.eligibleCourses.length===0) {
            setErrors((old) => ({ ...old, eligibleCoursesErr: "Select at least 1 Eligible Course" }));
            isValidated = false;

        }else{
            
            setErrors((old) => ({ ...old, eligibleCoursesErr: "" }));
        }
        
        // console.log(data.eligibleCourses.length)
        // console.log(errors,"data",data)
        return isValidated;

    }

    const generateEventHandler = async (e) => {
        e.preventDefault();


        if (!validateData()) return;


        setIsLoading((old) => true);
        const formData = new FormData();
        formData.append("ename", data.ename.trim());
        formData.append("etype", data.etype.trim());
        formData.append("ptype", data.ptype.trim());
        formData.append("enature", data.enature.trim());
        formData.append("noOfParticipants", data.noOfParticipants);
        formData.append("edate", formatDate(data.edate));
        formData.append("rcdate", formatDate(data.rcdate));
        formData.append("edetails", (data.edetails.trim()));
        formData.append("rules", (data.rules.trim()));
        formData.append("ebrochure", data.ebrochure);
        formData.append("eposter", data.eposter);
        formData.append("hasSubEvents", data.hasSubEvents);
        formData.append("subEvents", JSON.stringify(data.subEvents));
        formData.append("eligibleCourses", JSON.stringify(data.eligibleCourses));
        formData.append("eligibleSemester", JSON.stringify(data.eligibleSemester));
        formData.append("courseWiseResult", data.courseWiseResult);
        formData.append("generator",user._id);
        try {
            const { data } = await axios.post(`${API_URL}/api/events/generateevent`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    "auth-token": token,
                },
            });
            if (data.result) {
                toast.success(data.message);
                setData(initialState)
                setErrors(initialErrorState)
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
        finally {
            setIsLoading((old) => !old);
        }

    }



    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const fetchEventNatures = async()=>{

        try {
            
        const response = await axios.get(`${API_URL}/api/eventType/getEventTypes`,{
            headers:{
                "auth-token":token
            }
        })

        if(response.data.result){

            // console.log(response.data.data)
            setEventNatures((old)=>transformEventTypesData(response.data.data))
        }
        else{
            setEventNatures([]);
        }


        } catch (error) {
            
        }

    }


    useEffect(() => {
        setIsLoading(false)
        if (coursesData?.length === 0 || !Array.isArray(coursesData)) {
            dispatch(fetchAllCourses());
        }
        fetchEventNatures();
    }, [])


    const user = useSelector((state)=>state.UserSlice);
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!user || user?.role === "") return;
        if(user.role === "Student"){
            navigate("/home");
        }
        // console.log("called")
        setIsLoading(false)
    },[user,navigate])

    

    // const eventNatures = [{ name: "Cultural" }, { name: "IT" }, { name: "Management" }, { name: "Sports" }];
    const eventTypes = [{ name: "Intra-College" }, { name: "Inter-College" }];

    const semesterArr = useMemo(()=>{
        let maxSem = 0;
        for(let course of coursesData){
                maxSem = Math.max(maxSem,course.noOfSemesters);
            
        }
        const semesters = [];
        for(let i=1;i<=maxSem;i++){
            semesters.push(i);
        }
        return semesters;
    },[coursesData]);



    return (

        <>
            {
                isLoading
                &&
                <Overlay />
            }
            <section className='flex justify-center items-center'>
                <section className='p-5 md:p-10 shadow-2xl bg-white md:outline-none outline outline-blue-500 md:mt-0 md:mb-0 mt-2 w-full max-w-4xl'>
                    <p className='text-2xl text-center text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-2'>Generate Event</p>
                    <form method="post" className='p-4' onSubmit={generateEventHandler}>
                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <label htmlFor="ename">Event Name:</label>
                            <input
                                type="text"
                                name="ename"
                                value={data.ename}
                                onChange={updateData}
                                placeholder='Enter Event Name'
                                className='w-full shadow-lg md:p-3 rounded-lg p-2'
                                required
                            />
                        </section>
                        <section className='md:flex md:justify-start gap-10 md:items-center'>
                            <section className='md:p-2 md:m-2 p-1 m-1'>
                                <label htmlFor="etype">Event Nature:</label>
                                <Dropdown
                                    dataArr={eventNatures}
                                    selected={data.enature}
                                    setSelected={changeEventNature}
                                    name={"enature"}
                                    label={"Select Event Nature"}
                                    passedId={true}
                                />
                                {
                                    errors && errors.enatureErr !== ""
                                    &&
                                    <p className="text-red-500 my-2">
                                        {errors.enatureErr}
                                    </p>
                                }
                            </section>

                            <section className='md:p-2 md:m-2 p-1 m-1'>
                                <label htmlFor="nop">Event Type:</label>
                                <Dropdown
                                    dataArr={eventTypes}
                                    selected={data.etype}
                                    setSelected={changeEventType}
                                    name={"etype"}
                                    label={"Select Event Type"}
                                />
                                {
                                    errors && errors.etypeErr !== ""
                                    &&
                                    <p className="text-red-500 my-2">
                                        {errors.etypeErr}
                                    </p>
                                }
                            </section>
                        </section>



                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <p className="py-2">
                                Select Eligible Courses :
                            </p>
                            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 py-2 shadow-lg rounded-lg'>
                                {coursesData.map((course) => (
                                    <section key={course._id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={course._id}
                                            value={course._id}
                                            checked={data.eligibleCourses.includes(course._id)}
                                            onChange={() => handleCourseChange(course._id)}
                                            className='mr-2 cursor-pointer'
                                        />
                                        <label htmlFor={course._id} className="cursor-pointer">{course.courseName}</label>
                                    </section>
                                ))}
                            </section>
                            {
                                errors.eligibleCoursesErr !== ""
                                &&
                                <p className='text-red-500 my-2'>
                                    {
                                        errors.eligibleCoursesErr
                                    }
                                </p>
                            }
                        </section>

                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <ToggleSwitch headingText={"Has Sub Event?"} updateSelected={updateHasSubEvents} selected={data.hasSubEvents} />
                        </section>

                        {data?.hasSubEvents && (
                            <section className='md:p-2 md:m-2 p-1 m-1'>
                                <p className='flex gap-5 items-center'>
                                    Add Sub Events   <span className='rounded-lg  outline outline-blue-500'>
                                        <AddIcon className='cursor-pointer' onClick={setOpenAddSubEventModal} />
                                    </span>
                                </p>
                                <section className='max-w-full overflow-auto'>
                                    <table className="w-full md:w-[90vh] lg:w-[90vh] border-collapse border border-blue-500 my-3 rounded-lg">
                                        <thead className="">
                                            <tr>
                                                <th className="py-2 px-4 border border-blue-500">Sr No</th>
                                                <th className="py-2 px-4 border border-blue-500">Event Name</th>
                                                <th className="py-2 px-4 border border-blue-500">Participation Type</th>
                                                <th className="py-2 px-4 border border-blue-500">No Of Participants</th>
                                                <th className="py-2 px-4 border border-blue-500">Update</th>
                                                <th className="py-2 px-4 border border-blue-500">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.subEvents?.map((event, idx) => (
                                                <tr className="p-2" key={event?.sId}>
                                                    <td className="py-2 px-4 border border-blue-500">{idx + 1}</td>
                                                    <td className="py-2 px-4 border border-blue-500">{event.subEventName}</td>
                                                    <td className="py-2 px-4 border border-blue-500">{event.ptype}</td>
                                                    <td className="py-2 px-4 border border-blue-500">{event.noOfParticipants}</td>
                                                    <td className="py-2 px-4 border border-blue-500">
                                                        <EditIcon className="cursor-pointer" onClick={() => updateAddSubEvent(event.sId)} />
                                                    </td>
                                                    <td className="py-2 px-4 border border-blue-500">
                                                        <DeleteIcon className="cursor-pointer" onClick={() => removeSubEvent(event.sId)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            </section>
                        )}

                        {!data?.hasSubEvents && (
                            <>
                                                    <section className='md:p-2 md:m-2 p-1 m-1'>
                            <p className="py-2">
                                Select Eligible Semesters :
                            </p>
                            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 py-2 shadow-lg rounded-lg'>
                                {semesterArr.map((semester,id) => (
                                    <section key={id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={id}
                                            value={semester}
                                            checked={data.eligibleSemester.includes(semester)}
                                            onChange={() => handleSemesterChange(semester)}
                                            className='mr-2 cursor-pointer'
                                        />
                                        <label htmlFor={id} className="cursor-pointer">{semester}</label>
                                    </section>
                                ))}
                            </section>
                            {
                                errors.eligibleSemesterErr !== ""
                                &&
                                <p className='text-red-500 my-2'>
                                    {
                                        errors.eligibleSemesterErr
                                    }
                                </p>
                            }
                        </section>
                                <section className='md:flex md:justify-start gap-10 md:items-center'>
                                    <section className='md:p-2 md:m-2 p-1 m-1'>
                                        <label htmlFor="ptype">Participation  Type:</label>
                                        <Dropdown
                                            dataArr={[{ name: "Individual" }, { name: "Group" }]}
                                            selected={data.ptype}
                                            setSelected={changeParticipationType}
                                            name={"ptype"}
                                            label={"Select Participation Type"}
                                        />
                                        {
                                            errors && errors.ptypeErr !== ""
                                            &&
                                            <p className="text-red-500 my-2">
                                                {errors.ptypeErr}
                                            </p>
                                        }
                                    </section>
                                    <section className='md:p-2 md:m-2 p-1 m-1'>
                                        <label htmlFor="nop">Max No Of Team Members:</label>
                                        <input type="text"
                                            name="noOfParticipants"
                                            min={1}
                                            ref={noOfParticipants}
                                            value={data.noOfParticipants}
                                            onChange={updateData}
                                            onBlur={(e) => {
                                                if (e.target.name === "noOfParticipants") {
                                                    if (Number(e.target.value) <= 1) {
                                                        let num  = 1;
                                                        if(data.ptype==="Group"){
                                                            num = 2;
                                                        }
                                                        setData({ ...data, [e.target.name]: num });
                                                        return;
                                                    }
                                                }
                                            }}
                                            placeholder='Enter No Of Participants'
                                            className='block shadow-lg md:p-3 rounded-lg p-2'
                                            onKeyDown={handleNumericInput}
                                            required
                                        />
                                    </section>
                                </section>
                            </>
                        )}

                        <section className='md:flex md:justify-start gap-10 md:items-center'>
                            <section className='md:p-2 md:m-2  p-1 m-1'>
                                <label htmlFor="rcdate">Registration Closing  Date:</label><br />
                                <DatePicker
                                    name='rcdate'
                                    selected={data.rcdate}
                                    onChange={(date) => {

                                        if (date > data.edate) {
                                            setErrors((old) => ({ ...old, "edateErr": "Event Date Should be Greater Than Registration Closing Date" }))
                                        }
                                        else {
                                            setErrors((old) => ({ ...old, "edateErr": "" }))
                                        }

                                        setData({ ...data, rcdate: date })


                                    }
                                    }
                                    dateFormat="dd-MM-yyyy"
                                    minDate={new Date().setDate(new Date().getDate() - 1)}
                                    className="w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                                    showIcon
                                    icon={
                                        <section className="m-2">
                                            <CalanderIcon />
                                        </section>}
                                />
                            </section>
                            <section className='md:p-2 md:m-2  p-1 m-1'>
                                <label htmlFor="edate">Event Date:</label><br />
                                <DatePicker
                                    name='edate'
                                    selected={data.edate}
                                    onChange={(date) => {
                                        if (date < data.rcdate) {
                                            setErrors((old) => ({ edateErr: "Event Date Should be Greater Than Registration Closing Date" }))
                                        }
                                        else {
                                            setData({ ...data, edate: date })
                                            setErrors((old) => ({ edateErr: "" }))
                                        }
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                    minDate={new Date()}
                                    className=" w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                                    icon={
                                        <section className="m-2">
                                            <CalanderIcon />
                                        </section>}
                                    showIcon
                                />
                                {
                                    errors && errors.edateErr !== ""
                                    &&
                                    <p className="text-red-500 my-2">
                                        {errors.edateErr}
                                    </p>
                                }
                            </section>
                        </section>

                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <ToggleSwitch headingText={"Course Wise Result Declaration?"} updateSelected={updateCourseWiseResult} selected={data.courseWiseResult} />
                        </section>

                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <label htmlFor="details">Event Details:</label><br />
                            <textarea
                                name="edetails"
                                value={data.edetails}
                                onChange={updateData}
                                className='w-full shadow-lg md:p-3 rounded-lg p-2'
                                placeholder="Enter Event Details "
                                required
                            ></textarea>
                        </section>
                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <label htmlFor="rules">Rules For Events:</label><br />
                            <textarea
                                name="rules"
                                value={data.rules}
                                onChange={updateData}
                                className='w-full shadow-lg md:p-3 rounded-lg p-2'
                                placeholder="Enter Rules "
                                required
                            ></textarea>
                        </section>

                        {/* File upload sections */}

                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <section className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzoneFileForPoster"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUploadIcon className="h-10 w-10" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to Upload</span> or Drag and Drop Event Poster
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">

                                        </p>
                                    </section>
                                    <section className="mt-2">
                                        {data.eposter ? (
                                            <>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File: {data.eposter.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File Size : {formatFileSize(data.eposter.size)}
                                                </p>
                                            </>
                                        ) : null}
                                    </section>
                                    <input
                                        type="file"
                                        id="dropzoneFileForPoster"
                                        name="eposter"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            // console.log("poster",file);
                                            if (file && file.size > 10485760) {
                                                setFileErrors((old) => ({ ...old, posterError: "Poster Size Should be less than 10 Mb." }))
                                                setData({ ...data, eposter: null });
                                            }
                                            else {
                                                setData({ ...data, eposter: file });
                                                setFileErrors((old) => ({ ...old, posterError: "" }));
                                            }
                                        }}

                                    />
                                    {
                                        fileErrors &&
                                        <p className='text-red-500 py-2'>
                                            {fileErrors.posterError}
                                        </p>
                                    }
                                </label>

                            </section>
                        </section>

                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <section className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzoneFileForBrochure"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUploadIcon className="h-10 w-10" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop event brochure
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">

                                        </p>
                                    </section>
                                    <section className="mt-2">
                                        {data.ebrochure ? (
                                            <>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File: {data.ebrochure.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File Size : {formatFileSize(data.ebrochure.size)}
                                                </p>
                                            </>
                                        ) : null}
                                    </section>
                                    <input
                                        type="file"
                                        id="dropzoneFileForBrochure"
                                        name="ebrochure"
                                        className="hidden"
                                        accept=".pdf,.docx"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            // console.log("brochure",file);
                                            if (file && file.size > 10485760) {
                                                setFileErrors((old) => ({ ...old, brochureError: "Brochure Size Should be less than 10 Mb." }))
                                                setData({ ...data, ebrochure: null });
                                            }
                                            else {
                                                setData({ ...data, ebrochure: file });
                                                setFileErrors((old) => ({ ...old, brochureError: "" }))
                                            }
                                        }}

                                    />
                                    {
                                        fileErrors &&
                                        <p className='text-red-500 py-2'>
                                            {fileErrors.brochureError}
                                        </p>
                                    }
                                </label>

                            </section>
                        </section>

                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <input type="submit" value="Generate Event" className='text-red-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                        </section>
                    </form>
                </section>
            </section>
            <AddSubEvents openUpdateModal={openAddSubEventModal} setOpenUpdateModal={setOpenAddSubEventModal} heading={"Add Sub Event"} setData={setData} dataToBeUpdated={subEventDataToUpdate} setSubEventDataToUpdate={setSubEventDataToUpdate} semesterArr={semesterArr} />
        </>
    )
}

