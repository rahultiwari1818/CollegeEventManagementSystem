import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Overlay from '../components/Overlay';
import { ReactComponent as CheckIcon } from "../assets/Icons/CheckIcon.svg";
import { toast } from 'react-toastify';
import { debounce, transformCourseData } from '../utils';
import { ReactComponent as DownloadIcon } from "../assets/Icons/DownloadIcon.svg"
import ParticipationListPdf from '../PDF_Generator/ParticipationListPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import moment from "moment"
import RejectedImage from "../assets/images/RejectedIcon.png"
import PendingImage from "../assets/images/PendingIcon.png"
import ApprovalImage from "../assets/images/ApprovalIcon.png"
import Dropdown from '../components/Dropdown';
import Skeleton from 'react-loading-skeleton';

export default function ViewRegistration() {
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [registrationData, setRegistrationData] = useState([]);
    const [showOverlay, setShowOverlay] = useState(true);
    const [collegeData, setCollegeData] = useState({});
    const [searchParams, setSearchParams] = useState(""); // State to hold filter criteria
    const [eventData, setEventData] = useState({});
    const [eligibleCourses, setEligibleCourses] = useState([]);
    const [filterParams, setFilterParams] = useState({
        sId: 0,
        courseId: ""
    })
    const [isDataLoading, setIsDataLoading] = useState(false);

    const [filteredData, setFilteredData] = useState([]);

    const { eventId } = useParams();

    useEffect(() => {
        const fetchRegistrationDetails = async () => {
            try {
                setIsDataLoading(true);
                const { data } = await axios.get(`${API_URL}/api/events/getRegistrationDataOfEvent`, {
                    params: {
                        eventId: eventId,
                        status: searchParams
                    },
                    headers: {
                        "auth-token": token
                    }
                });
                // console.log("data data", data.data);
                if (data.result) {

                    if (data?.data[0]?.sId) {
                        const map = {};
                        for (let subEvent of data.data) {
                            map[subEvent.sId] ? map[subEvent.sId].push(subEvent) : map[subEvent.sId] = [subEvent];
                        }

                        const events = Object.values(map);
                        setRegistrationData(events);
                    } else {
                        setRegistrationData(data?.data);
                    }
                }
            } catch (error) {
                // Handle error
            }
            finally {
                setIsDataLoading(false);
            }
        };

        const fetchEventData = async () => {

            try {

                const { data } = await axios.get(`${API_URL}/api/events/getSpecificEvent/${eventId}`, {
                    headers: {
                        "auth-token": token
                    }
                })

                if (data?.result) {
                    setEventData(data?.data);
                    // console.log(data.data.eligibleCourses)
                    setEligibleCourses(() => transformCourseData(data.data.eligibleCourses, true))
                }
                else {
                    setEventData({});
                }


            } catch (error) {
                console.log(error)
            }
        }

        fetchEventData();

        fetchRegistrationDetails();
    }, [eventId, searchParams]);

    useEffect(() => {

        const fetchCollegeData = async () => {

            try {

                const { data } = await axios.get(`${API_URL}/api/faculties/getCollegeDetails`, {
                    headers: {
                        "auth-token": token,
                    }
                })

                setCollegeData(data.data[0])


            } catch (error) {
                console.log(error)
            }


        }

        fetchCollegeData();
        setShowOverlay(false);
    }, [])

    const changeFilterCourse = useCallback((value) => {
        setFilterParams((old) => ({ ...old, courseId: value }))
    }, [])

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

    useEffect(() => {
        // Function to filter registration data based on course ID
        const filterRegistrationData = () => {
            setIsDataLoading(true);
            if (eventData?.hasSubEvents) {
                // if has sub events
                if (!filterParams.courseId) {
                    setFilteredData(registrationData);
                } else {
                    // Filter registration data based on the selected course ID
                    if (filterParams.courseId == 0) {
                        setFilteredData(registrationData)
                    }
                    else {
                        const filtered = [];
                        registrationData.forEach(subEvent => {

                            filtered.push(subEvent.filter(team => team.studentData?.at(0)?.course._id === filterParams.courseId))
                        });
                        // console.log(filtered)
                        setFilteredData(filtered);
                    }

                }
            }
            else {
                // if it does not have sub events
                if (!filterParams.courseId) {
                    setFilteredData(registrationData);
                } else {
                    // Filter registration data based on the selected course ID
                    if (filterParams.courseId == 0) {
                        setFilteredData(registrationData)
                    }
                    else {
                        const filtered = registrationData.filter(team => {
                            return team.studentData?.at(0).course._id === filterParams.courseId
                        });
                        // console.log(filtered)
                        setFilteredData(filtered);
                    }

                }
            }
            setIsDataLoading(false);
        };

        filterRegistrationData();
    }, [registrationData, filterParams.courseId]);


    return (
        <>
            {
                showOverlay &&
                <Overlay />
            }
            <section className='mb-5'>
                <section className="py-3 px-4 rounded-lg shadow-lg min-h-[50vh]">
                    <p className=' text-base md:text-2xl text-center text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-2'>
                        {
                            eventData?.ename ?
                                <> Registration Requests of {eventData.ename}</> :
                                <> No New {searchParams} Registrations </>
                        }
                    </p>
                    <section className='md:flex justify-between gap-5 items-center my-2'>

                        <Dropdown dataArr={eligibleCourses} selected={filterParams.courseId} setSelected={changeFilterCourse} name="searchCourse" label="Select Course" passedId={true} />


                        {eventData?.ename &&
                            <PDFDownloadLink document={<ParticipationListPdf eventData={eventData} registrationData={filteredData} collegeData={collegeData} />} fileName={`${eventData?.ename}ParticipationList.pdf`} className='w-full my-2'>

                                <button className='px-5 py-2 rounded-lg shadow-lg text-white bg-green-500  hover:outline hover:outline-green-700 my-3'>
                                    <section className="flex justify-between items-center gap-5">
                                        <p>Download {searchParams === "" ? "All" : searchParams} Participation List</p>
                                        <DownloadIcon />
                                    </section>
                                </button>
                            </PDFDownloadLink>
                        }
                    </section>
                    <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 my-3 '>
                        {/* Add onClick handlers to filter buttons */}
                        <button className="px-5 py-2 rounded-lg shadow-lg text-white bg-yellow-500 hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500 " onClick={() => handleFilterClick("")}> View All Requests</button>
                        <button className="px-5 py-2 rounded-lg shadow-lg text-white bg-yellow-500 hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500 " onClick={() => handleFilterClick("pending")}> View Pending Requests</button>
                        <button className="px-5 py-2 rounded-lg shadow-lg text-white bg-yellow-500 hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500 " onClick={() => handleFilterClick("approved")}> View Approved Requests</button>
                        <button className="px-5 py-2 rounded-lg shadow-lg text-white bg-yellow-500 hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500 " onClick={() => handleFilterClick("rejected")}>
                            View Rejected Requests
                        </button>
                    </section>
                    {
                        isDataLoading
                        ?
                        <section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                            <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                {/* Table header */}
                                <thead className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white'>
                                    <tr>
                                        <td className='px-2 py-2 md:px-4'>Sr No</td>
                                        <td className='px-2 py-2 md:px-4'>SID</td>
                                        <td className='px-2 py-2 md:px-4'>Name</td>
                                        <td className='px-2 py-2 md:px-4'>Course</td>
                                        <td className='px-2 py-2 md:px-4'>Semester</td>
                                        <td className='px-2 py-2 md:px-4'>Division</td>
                                        <td className='px-2 py-2 md:px-4'>Mobile No.</td>
                                        <td className='px-2 py-2 md:px-4'>Registration Time.</td>
                                        <td className='px-2 py-2 md:px-4'>Status</td>
                                        <td className='px-2 py-2 md:px-4'>Action</td>
                                    </tr>
                                </thead>
                                {/* Table body */}
                                <tbody>

                                    {
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((studentTeam, teamIdx) => {
                                            return (
                                                <tr key={teamIdx}>
                                                    {/* Table cells */}
                                                    <td className='border px-2 py-2 md:px-4 ' >
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4 '>
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4 '>
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4 '>
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4 '>
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4 '>
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4 '>
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4 ' >
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        /></td>


                                                    <td className='border px-2 py-2 md:px-4 ' >
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>

                                                    <td className='border px-2 py-2 md:px-4  gap-4 ' >
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </section>
                    :
                                        // {/* Render registration data based on filter criteria */}

                    eventData.hasSubEvents ? (
                        filteredData?.map((subEvent) => {
                            if (subEvent.length > 0) {
                                return (
                                    <section key={subEvent.sId} className='my-3 border border-blue-500 py-3 px-3 shadow-lg' >
                                        <p className=' text-base md:text-lg text-center text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-2'>
                                            Registration Requests of {subEvent[0].subEventName}
                                        </p>
                                        <section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                                            <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                                {/* Table header */}
                                                <thead className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white'>
                                                    <tr>
                                                        <td className='px-2 py-2 md:px-4'>Sr No</td>
                                                        <td className='px-2 py-2 md:px-4'>SID</td>
                                                        <td className='px-2 py-2 md:px-4'>Name</td>
                                                        <td className='px-2 py-2 md:px-4'>Course</td>
                                                        <td className='px-2 py-2 md:px-4'>Semester</td>
                                                        <td className='px-2 py-2 md:px-4'>Division</td>
                                                        <td className='px-2 py-2 md:px-4'>Mobile No.</td>
                                                        <td className='px-2 py-2 md:px-4'>Registration Time.</td>
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
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.studentName}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.course.courseName}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.semester}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.division}</td>
                                                                        <td className='border px-2 py-2 md:px-4 '>{team.phno}</td>
                                                                        {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>{moment(studentTeam.createdAt).format("lll")}</td>}
                                                                        {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>
                                                                            {
                                                                                studentTeam.status === "pending"
                                                                                    ?
                                                                                    <img src={PendingImage} className='w-10' alt="pending" />
                                                                                    :
                                                                                    studentTeam.status === "rejected"
                                                                                        ?
                                                                                        <img src={RejectedImage} className='w-10' alt="rejected" />
                                                                                        :
                                                                                        <img src={ApprovalImage} className='w-10' alt="approval" />
                                                                            }
                                                                        </td>}
                                                                        {idx === 0 &&
                                                                            <td className='border px-2 py-2 md:px-4  gap-4 ' rowSpan={studentTeam.studentData.length}>
                                                                                <section className='grid lg:grid-cols-2  grid-cols-1 gap-5 '>
                                                                                    {/* Approve button */}
                                                                                    {
                                                                                        (studentTeam.status === "pending" || studentTeam.status === "rejected")
                                                                                        &&
                                                                                        <button className='px-2 md:px-4 py-2  rounded-full lg:rounded-lg shadow-lg bg-green-500 text-white min-w-fit'
                                                                                            onClick={() => throttledChangeRequestStatus(studentTeam._id, "approved")}>
                                                                                            <p className='hidden lg:block'>Approve</p>
                                                                                            <p className=' lg:hidden'><CheckIcon /></p>
                                                                                        </button>
                                                                                    }

                                                                                    {/* Reject button */}
                                                                                    {
                                                                                        (studentTeam.status === "pending" || studentTeam.status === "approved") &&
                                                                                        <button className='min-w-fit px-2 md:px-4 py-2 rounded-full lg:rounded-lg shadow-lg bg-red-500 text-white'
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
                                <thead className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white'>
                                    <tr>
                                        <td className='px-2 py-2 md:px-4'>Sr No</td>
                                        <td className='px-2 py-2 md:px-4'>SID</td>
                                        <td className='px-2 py-2 md:px-4'>Name</td>
                                        <td className='px-2 py-2 md:px-4'>Course</td>
                                        <td className='px-2 py-2 md:px-4'>Semester</td>
                                        <td className='px-2 py-2 md:px-4'>Division</td>
                                        <td className='px-2 py-2 md:px-4'>Mobile No.</td>
                                        <td className='px-2 py-2 md:px-4'>Registration Time.</td>
                                        <td className='px-2 py-2 md:px-4'>Status</td>
                                        <td className='px-2 py-2 md:px-4'>Action</td>
                                    </tr>
                                </thead>
                                {/* Table body */}
                                <tbody>
                                    {
                                        filteredData.length === 0
                                            ?
                                            <tr>
                                                <td className='border px-2 text-center py-2 md:px-4 '
                                                    colSpan={10}
                                                >
                                                    No Data Found
                                                </td>
                                            </tr>
                                            :
                                            filteredData?.map((teams, idx) => {

                                                return (
                                                    teams.studentData?.map((studentTeam, teamIdx) => {
                                                        return (
                                                            <tr key={teamIdx}>
                                                                {/* Table cells */}
                                                                {teamIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={teams.studentData.length}>{idx + 1}</td>}
                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.sid}</td>
                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.studentName}</td>
                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.course.courseName}</td>
                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.semester}</td>
                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.division}</td>
                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.phno}</td>
                                                                {teamIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={teams.studentData.length}>{moment(teams.createdAt).format("lll")}</td>}

                                                                {teamIdx === 0 &&
                                                                    <td className='border px-2 py-2 md:px-4 ' rowSpan={teams.studentData.length}>
                                                                        {
                                                                            teams.status === "pending"
                                                                                ?
                                                                                <img src={PendingImage} className='w-10' alt="pending " />
                                                                                :
                                                                                teams.status === "rejected"
                                                                                    ?
                                                                                    <img src={RejectedImage} className='w-10' alt="rejected " />
                                                                                    :
                                                                                    <img src={ApprovalImage} className='w-10' alt="approval " />
                                                                        }                                                            </td>
                                                                }
                                                                {teamIdx === 0 &&
                                                                    <td className='border px-2 py-2 md:px-4  gap-4 ' rowSpan={teams.studentData.length}>
                                                                        <section className='grid lg:grid-cols-2  grid-cols-1 gap-5 '>
                                                                            {/* Approve button */}
                                                                            {(teams.status === "pending" || teams.status === "rejected") && (
                                                                                <button className='min-w-fit px-2 md:px-4 py-2  rounded-full lg:rounded-lg shadow-lg bg-green-500 text-white'
                                                                                    onClick={() => throttledChangeRequestStatus(teams._id, "approved")}>
                                                                                    <p className='hidden lg:block'>Approve</p>
                                                                                    <p className=' lg:hidden'><CheckIcon /></p>
                                                                                </button>
                                                                            )}

                                                                            {/* Reject button */}
                                                                            {teams.status === "pending" || teams.status === "approved" ? (
                                                                                <button className='min-w-fit px-2 md:px-4 py-2 rounded-full lg:rounded-lg shadow-lg bg-red-500 text-white'
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
