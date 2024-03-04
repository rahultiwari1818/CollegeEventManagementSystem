import React, { useCallback, useEffect, useState } from 'react'
import Overlay from '../components/Overlay'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/Dropdown';
import { transformSubEventData } from '../utils';

export default function EventResultDeclaration() {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const [searchParams, setSearchParams] = useState({
        sId: 0
    })
    const [eventData, setEventData] = useState([]);
    const [subEvents, setSubEvents] = useState([]);
    const [eventRegistrations, setEventRegistrations] = useState([]);
    const [subEventRegistrations, setSubEventRegistrations] = useState([]);
    const [showOverLay, setShowOverLay] = useState(true)
    const userData = useSelector((state) => state.UserSlice);
    const navigate = useNavigate();

    const { eventId } = useParams();

    const updateSid = useCallback((value) => {
        setSearchParams((old) => ({ ...old, sId: value }))
    }, [])


    useEffect(() => {
        const arr = [];
        eventRegistrations?.forEach((team) => {
            if (team.sId == searchParams.sId) {
                arr.push(team);
                console.log(team, "team")
            }
        })
        setSubEventRegistrations(arr);
    }, [eventId, searchParams.sId])


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

    return (
        <>
            {
                showOverLay
                &&
                <Overlay />
            }
            <section className='my-2 px-2 py-2'>
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
                <section className="my-2 py-3">
                    <section className="overflow-x-auto  overflow-y-auto border border-blue-500 border-solid rounded-t-lg">
                        <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <td className='px-2 py-2 md:px-4'>Sr No</td>
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
                                                        <tr key={team._id}>
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
                                                        <tr key={stdIdx}>
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

                </section>
            </section>
        </>
    )
}
