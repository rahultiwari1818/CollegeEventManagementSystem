import React, { useCallback, useEffect, useState } from 'react'
import Overlay from '../components/Overlay'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/Dropdown';
import { transformCourseData, transformSubEventData } from '../utils';

export default function EventResultDeclaration() {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const [searchParams, setSearchParams] = useState({
        sId: 0,
        course:""
    })
    const [eventData, setEventData] = useState([]);
    const [subEvents, setSubEvents] = useState([]);
    const [eventRegistrations, setEventRegistrations] = useState([]);
    const [eligibleCourses,setEligibleCourses] = useState([]);
    const [subEventRegistrations, setSubEventRegistrations] = useState([]);
    const [showOverLay, setShowOverLay] = useState(true)
    const userData = useSelector((state) => state.UserSlice);
    const navigate = useNavigate();

    const { eventId } = useParams();

    const updateSid = useCallback((value) => {
        setSearchParams((old) => ({ ...old, sId: value }))
    }, [])

    const updateCourse = useCallback((value)=>{
        setSearchParams((old)=>({...old,course:value}))
    })

    useEffect(() => {
        const arr = [];
        eventRegistrations?.forEach((team) => {
            if (team.sId == searchParams.sId) {
                arr.push(team);
            }
        })
        setSubEventRegistrations(arr);
    }, [eventId, searchParams.sId])

    useEffect(()=>{
        
    },[searchParams.course])


    useEffect(() => {

        const fetchEventData = async () => {

            try {

                const { data } = await axios.get(`${API_URL}/api/events/getSpecificEvent/${eventId}`, {
                    headers: {
                        "auth-token": token
                    }
                })

                if (data?.result) {
                    setEventData(data?.data);
                    if (data?.data?.hasSubEvents) {
                        setSubEvents(transformSubEventData(data?.data.subEvents))
                    }
                    console.log(data.data.eligibleCourses)
                    setEligibleCourses(()=>transformCourseData(data.data.eligibleCourses))
                }
                else {
                    setEventData({});
                }


            } catch (error) {
                console.log(error)
            }
        }

        const fetchRegistrationData = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/events/getRegistrationDataOfEvent`, {
                    params: {
                        eventId: eventId,
                        status: "approved"
                    },
                    headers: {
                        "auth-token": token
                    }
                });
                if (data.result) {

                    setEventRegistrations(data?.data);

                }
            } catch (error) {
                // Handle error
            }
        };

        fetchRegistrationData();

        fetchEventData();

    }, [eventId])



    useEffect(() => {
        if (!userData || userData?.role === "" || userData?.role === undefined) return;
        if (userData.role === "Student") {
            navigate("/home");
        }
        setShowOverLay(false);
    }, [userData, navigate]);


    const handleDragStart = (event, teamId, idx) => {
        event.dataTransfer.setData("text/plain", teamId);
        event.dataTransfer.setData("text/idx", idx);
    };

    const handleDrop = (event, teamId, dropIdx) => {
        const draggedTeamId = event.dataTransfer.getData("text/plain");
        const dragIdx = event.dataTransfer.getData("text/idx");
        const updatedSubEventRegistrations = [...subEventRegistrations];
        const draggedTeam = updatedSubEventRegistrations.splice(dragIdx, 1)[0];
        updatedSubEventRegistrations.splice(dropIdx, 0, draggedTeam);
        setSubEventRegistrations(updatedSubEventRegistrations);
    };

    const handleEventDrop = (event, teamId, dropIdx) => {
        const draggedTeamId = event.dataTransfer.getData("text/plain");
        const dragIdx = event.dataTransfer.getData("text/idx");
        const updatedEventRegistrations = [...eventRegistrations];
        const draggedTeam = updatedEventRegistrations.splice(dragIdx, 1)[0];
        updatedEventRegistrations.splice(dropIdx, 0, draggedTeam);
        setEventRegistrations(updatedEventRegistrations);
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    };


    const declareResults = () => {

        try {

            if (eventData.hasSubEvents && searchParams.sId <= 0) {
                return;
            }

            const dataToPost = eventData.hasSubEvents ?
                subEventRegistrations.slice(0, 3).map((reg) => reg._id)
                :
                eventRegistrations.slice(0, 3).map((reg) => reg._id);



        } catch (error) {
            console.log(error)
        }

    }


    return (
        <>
            {
                showOverLay
                &&
                <Overlay />
            }
            <section className='my-2 px-2 py-2'>
                <p className="text-lg my-2 text-center bg-red-500 text-white py-2">
                    Just Drag the Participant to the Specified Position for Ranking
                </p>
                {
                    !eventData?.hasSubEvents
                        ?

                        <p className=' text-base md:text-2xl text-center text-white bg-blue-500 p-2'>
                            Participants of {eventData.ename}
                        </p>
                        :
                        <section className='text-lg md:text-xl  text-white bg-blue-500 p-2 grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <p className='flex items-center'>
                                Select an SubEvent to Declare Result :
                            </p>
                            <section className=''>
                                <Dropdown
                                    dataArr={subEvents}
                                    selected={searchParams.sId}
                                    setSelected={updateSid}
                                    name={"subEvent"}
                                    label={"Select Sub Event Event "}
                                    className={true}
                                    passedId={true}
                                />
                            </section>
                        </section>
                }
                {
                    eventData.courseWiseResultDeclaration &&
                    <section className='my-2 text-lg md:text-xl  text-white bg-blue-500 p-2 grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <p className='flex items-center'>
                            Select an Course to Declare Result :
                        </p>
                        <section className=''>
                            <Dropdown
                                dataArr={eligibleCourses}
                                selected={searchParams.course}
                                setSelected={updateCourse}
                                name={"course"}
                                label={"Select Course To Declare Result "}
                                className={true}
                                passedId={true}
                            />
                        </section>
                    </section>
                }
                <section className="my-2 py-3">
                    <section className="overflow-x-auto  overflow-y-auto border border-blue-500 border-solid rounded-t-lg">
                        <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <td className='px-2 py-2 md:px-4'>Sr No</td>
                                    <td className='px-2 py-2 md:px-4'>Rank</td>
                                    <td className='px-2 py-2 md:px-4'>SID</td>
                                    <td className='px-2 py-2 md:px-4'>Name</td>
                                    <td className='px-2 py-2 md:px-4'>Course</td>
                                    <td className='px-2 py-2 md:px-4'>Semester</td>
                                    <td className='px-2 py-2 md:px-4'>Division</td>
                                    <td className='px-2 py-2 md:px-4'>Mobile No.</td>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                {

                                    (eventData.hasSubEvents !== undefined && !eventData.hasSubEvents)
                                        ?
                                        eventRegistrations?.map((team, idx) => {
                                            return (
                                                team.studentData?.map((student, stdIdx) => {
                                                    return (
                                                        <tr key={stdIdx} className='cursor-grab' draggable onDragStart={(e) => handleDragStart(e, team._id, idx)} onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleEventDrop(e, team._id, idx)}>
                                                            {stdIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={team.studentData.length}>{idx + 1}</td>}
                                                            {stdIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={team.studentData.length}>{idx + 1}</td>}

                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.sid
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.studentName
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.course.courseName
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.semester
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.division
                                                                }
                                                            </td>

                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.phno
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        })
                                        :
                                        subEventRegistrations?.map((team, idx) => {
                                            return (
                                                team.studentData?.map((student, stdIdx) => {
                                                    return (
                                                        <tr key={stdIdx} className='cursor-grab ' draggable onDragStart={(e) => handleDragStart(e, team._id, idx)} onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, team._id, idx)}>
                                                            {stdIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={team.studentData.length}>{idx + 1}</td>}
                                                            {stdIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={team.studentData.length}>{idx + 1}</td>}
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.sid
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.studentName
                                                                }
                                                            </td>

                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.course.courseName
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.semester
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.division
                                                                }
                                                            </td>
                                                            <td className='border px-2 py-2 md:px-4 '>
                                                                {
                                                                    student.phno
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </section>
                    <section className="my-2">
                        <button
                            className='text-yellow-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-yellow-500 hover:text-white hover:bg-yellow-500 '
                            onClick={declareResults}
                        >
                            Complete Result Declaration
                        </button>
                    </section>
                </section>
            </section>
        </>
    )
}
