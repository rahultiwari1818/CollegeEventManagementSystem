import axios from 'axios';
import React, {  useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Overlay from '../components/Overlay';
import { ReactComponent as CheckIcon } from "../assets/Icons/CheckIcon.svg";
import { toast } from 'react-toastify';
import { debounce } from '../utils';

export default function ViewRegistration() {
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [registrationData, setRegistrationData] = useState([]);
    const [searchParams, setSearchParams] = useState(""); // State to hold filter criteria
    const [eventData, setEventData] = useState({
        ename: "",
        hasSubEvents: ""
    });
    const { eventId } = useParams();

    useEffect(() => {
        const fetchRegistrationDetails = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/events/getRegistrationDataOfEvent`, {
                    params: {
                        eventId: eventId,
                        status: searchParams
                    },
                    headers: {
                        "auth-token": token
                    }
                });
                console.log("data data", data.data);
                if (data.result) {
                    setEventData((old) => ({ ...old, ename: data?.data[0]?.ename }));

                    if (data?.data[0]?.sId) {
                        setEventData((old) => ({ ...old, hasSubEvents: true }));
                        const map = {};
                        for (let subEvent of data.data) {
                            map[subEvent.sId] ? map[subEvent.sId].push(subEvent) : map[subEvent.sId] = [subEvent];
                        }

                        const events = Object.values(map);
                        setRegistrationData(events);
                    } else {
                        setEventData((old) => ({ ...old, hasSubEvents: false }));
                        setRegistrationData(data?.data);
                    }
                }
            } catch (error) {
                // Handle error
            }
        };

        fetchRegistrationDetails();
    }, [eventId, searchParams]);

    const changeRequestStatus = async (reqId, status) => {
        try {
            const { data } = await axios.patch(`${API_URL}/api/events/changeRequestStatus`, {
                status: status,
                reqId: reqId
            }, {
                headers: {
                    "auth-token": token
                }
            });
            if (data.result) {
                toast.success(data.message);
                updateRegistrationData(reqId, status);
            }
        } catch ({ response }) {
            toast.error(response.data.message);
        }
    };

    const throttledChangeRequestStatus = debounce(changeRequestStatus, 1000);

    const updateRegistrationData = (reqId, status) => {
        if (eventData.hasSubEvents) {
            setRegistrationData((old) => {
                const newData = [];
                old?.forEach((subEvent) => {
                    const subEventArr = [];
                    subEvent?.forEach((team) => {
                        team._id === reqId ?

                            (searchParams === "" &&
                                subEventArr.push({
                                    ...team,
                                    status: status
                                })) :
                            subEventArr.push(team);
                    });
                    newData.push(subEventArr);
                });
                return newData;
            });
        } else {
            setRegistrationData((old) => {
                const newData = [];
                old?.forEach((team) => {
                    team._id === reqId ?
                        (searchParams === "" &&
                            newData.push({
                                ...team,
                                status: status
                            })) :
                        newData.push(team);
                });
                return newData;
            });
        }
    };

    // Function to handle filter clicks
    const handleFilterClick = (filterParam) => {
        setSearchParams(filterParam); // Update searchParams state
    };

    return (
        <>
            {
                false &&
                <Overlay />
            }
            <section className='mb-5'>
                <section className="py-3 px-4 rounded-lg shadow-lg">
                    <p className=' text-base md:text-2xl text-center text-white bg-blue-500 p-2'>
                        {
                            eventData?.ename ?
                                <> Registration Requests of {eventData.ename}</> :
                                <> No New {searchParams} Registrations </>
                        }
                    </p>
                    <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 my-3 '>
                        {/* Add onClick handlers to filter buttons */}
                        <button className="px- py-2 rounded-lg shadow-lg text-white bg-yellow-500" onClick={() => handleFilterClick("")}> View All Requests</button>
                        <button className="px- py-2 rounded-lg shadow-lg text-white bg-yellow-500" onClick={() => handleFilterClick("pending")}> View Pending Requests</button>
                        <button className="px- py-2 rounded-lg shadow-lg text-white bg-yellow-500" onClick={() => handleFilterClick("approved")}> View Approved Requests</button>
                        <button className="px- py-2 rounded-lg shadow-lg text-white bg-yellow-500" onClick={() => handleFilterClick("rejected")}>
                            View Rejected Requests
                        </button>
                    </section>
                    {/* Render registration data based on filter criteria */}
                    {eventData.hasSubEvents ? (
                        registrationData?.map((subEvent) => {
                            if (subEvent.length > 0) {
                                return (
                                    <section key={subEvent.sId} className='my-3 border border-blue-500 py-3 px-3 shadow-lg' >
                                        <p className=' text-base md:text-lg text-center text-white bg-blue-500 p-2'>
                                            Registration Requests of {subEvent[0].subEventName}
                                        </p>
                                        <section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                                            <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                                {/* Table header */}
                                                <thead className='bg-blue-500 text-white'>
                                                    <tr>
                                                        <td className='px-2 py-2 md:px-4'>Sr No</td>
                                                        <td className='px-2 py-2 md:px-4'>SID</td>
                                                        <td className='px-2 py-2 md:px-4'>Name</td>
                                                        <td className='px-2 py-2 md:px-4'>Course</td>
                                                        <td className='px-2 py-2 md:px-4'>Semester</td>
                                                        <td className='px-2 py-2 md:px-4'>Division</td>
                                                        <td className='px-2 py-2 md:px-4'>Request Status</td>
                                                        <td className='px-2 py-2 md:px-4'>Action</td>
                                                    </tr>
                                                </thead>
                                                {/* Table body */}
                                                <tbody>
                                                    {subEvent?.map((studentTeam, teamIdx) => {
                                                        return (
                                                            studentTeam.studentData?.map((team, idx) => {
                                                                return (
                                                                    <tr key={idx}>
                                                                        {/* Table cells */}
                                                                        {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>{teamIdx + 1}</td>}
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.sid}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{idx === 0 ? team.name : team.studentName}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.course}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.semester}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.division}</td>
                                                                        {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>{studentTeam.status}</td>}
                                                                        {idx === 0 &&
                                                                            <td className='border px-2 py-2 md:px-4  gap-4 ' rowSpan={studentTeam.studentData.length}>
                                                                                <section className='grid lg:grid-cols-2  grid-cols-1 gap-5 '>
                                                                                    {/* Approve button */}
                                                                                   {
                                                                                    (studentTeam.status === "pending" || studentTeam.status === "rejected")
                                                                                    &&
                                                                                    <button className='px-2 md:px-4 py-2  rounded-full lg:rounded-lg shadow-lg bg-green-500 text-white'
                                                                                        onClick={() => throttledChangeRequestStatus(studentTeam._id, "approved")}>
                                                                                        <p className='hidden lg:block'>Approve</p>
                                                                                        <p className=' lg:hidden'><CheckIcon /></p>
                                                                                    </button>
                                                                                   } 

                                                                                    {/* Reject button */}
                                                                                    {
                                                                                    (studentTeam.status === "pending" || studentTeam.status ==="approved")                                                      &&
                                                                                    <button className='px-2 md:px-4 py-2 rounded-full lg:rounded-lg shadow-lg bg-red-500 text-white'
                                                                                        onClick={() => throttledChangeRequestStatus(studentTeam._id, "rejected")}>
                                                                                        <p className='hidden lg:block'>Reject</p>
                                                                                        <p className=' lg:hidden'>X</p>
                                                                                    </button>
                                                                                    }
                                                                                </section>
                                                                            </td>}
                                                                    </tr>
                                                                );
                                                            })
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </section>
                                    </section>
                                );
                            }
                            else {
                                return <></>
                            }
                        })
                    ) : (
                        <section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                            <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                {/* Table header */}
                                <thead className='bg-blue-500 text-white'>
                                    <tr>
                                        <td className='px-2 py-2 md:px-4'>Sr No</td>
                                        <td className='px-2 py-2 md:px-4'>SID</td>
                                        <td className='px-2 py-2 md:px-4'>Name</td>
                                        <td className='px-2 py-2 md:px-4'>Course</td>
                                        <td className='px-2 py-2 md:px-4'>Semester</td>
                                        <td className='px-2 py-2 md:px-4'>Division</td>
                                        <td className='px-2 py-2 md:px-4'>Status</td>
                                        <td className='px-2 py-2 md:px-4'>Action</td>
                                    </tr>
                                </thead>
                                {/* Table body */}
                                <tbody>
                                    {registrationData?.map((teams, idx) => {

                                        return (
                                            teams.studentData?.map((studentTeam, teamIdx) => {
                                                return (
                                                    <tr key={teamIdx}>
                                                        {/* Table cells */}
                                                        {teamIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={teams.studentData.length}>{idx + 1}</td>}
                                                        <td className='border px-2 py-2 md:px-4 '>{studentTeam.sid}</td>
                                                        <td className='border px-2 py-2 md:px-4 '>{teamIdx === 0 ? studentTeam.name : studentTeam.studentName}</td>
                                                        <td className='border px-2 py-2 md:px-4 '>{studentTeam.course}</td>
                                                        <td className='border px-2 py-2 md:px-4 '>{studentTeam.semester}</td>
                                                        <td className='border px-2 py-2 md:px-4 '>{studentTeam.division}</td>
                                                        {teamIdx === 0 &&
                                                            <td className='border px-2 py-2 md:px-4 ' rowSpan={teams.studentData.length}>
                                                                {teams.status}
                                                            </td>
                                                        }
                                                        {teamIdx === 0 &&
                                                            <td className='border px-2 py-2 md:px-4  gap-4 ' rowSpan={teams.studentData.length}>
                                                                <section className='grid lg:grid-cols-2  grid-cols-1 gap-5 '>
                                                                    {/* Approve button */}
                                                                    {(teams.status === "pending" || teams.status === "rejected")  && (
                                                                        <button className='px-2 md:px-4 py-2  rounded-full lg:rounded-lg shadow-lg bg-green-500 text-white'
                                                                            onClick={() => throttledChangeRequestStatus(teams._id, "approved")}>
                                                                            <p className='hidden lg:block'>Approve</p>
                                                                            <p className=' lg:hidden'><CheckIcon /></p>
                                                                        </button>
                                                                    )}

                                                                    {/* Reject button */}
                                                                    {teams.status === "pending" || teams.status === "approved" ? (
                                                                        <button className='px-2 md:px-4 py-2 rounded-full lg:rounded-lg shadow-lg bg-red-500 text-white'
                                                                            onClick={() => throttledChangeRequestStatus(teams._id, "rejected")}>
                                                                            <p className='hidden lg:block'>Reject</p>
                                                                            <p className=' lg:hidden'>X</p>
                                                                        </button>
                                                                    ) : null}
                                                                </section>

                                                            </td>}
                                                    </tr>
                                                );
                                            })
                                        );
                                    })}
                                </tbody>
                            </table>
                        </section>
                    )}
                </section>
            </section>
        </>
    );
}
