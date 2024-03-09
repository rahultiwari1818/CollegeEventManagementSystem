import React, { useEffect, useState } from 'react';
import Overlay from '../components/Overlay';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RejectedImage from "../assets/images/RejectedIcon.png"
import PendingImage from "../assets/images/PendingIcon.png"
import ApprovalImage from "../assets/images/ApprovalIcon.png"
import moment from "moment";
import Skeleton from 'react-loading-skeleton';

export default function MyEvents() {


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOverLay, setShowOverLay] = useState(true);

    const user = useSelector((state) => state.UserSlice);
    const navigate = useNavigate();

    const fetchStudentEventData = async () => {

        try {
            const { data } = await axios.get(`${API_URL}/api/events/studentParticipatedEvents/${user._id}`, {
                headers: {
                    "auth-token": token,
                }
            })
            if (data.result) {
                setRegisteredEvents(data?.data)
            }

        } catch (error) {

            console.log(error)
            setRegisteredEvents([])
        }
        finally{
            setIsLoading(false)
        }

    }


    useEffect(() => {
        if (!user || user?.role === "" || user?.role === undefined) return;
        if (user.role !== "Student") {
            navigate("/home");
        }

        fetchStudentEventData();

        setShowOverLay(false)
    }, [user, navigate])


    return (
        <>
            {
                showOverLay &&
                <Overlay />
            }
            <section className='py-2 pb-5'>
                <section className="flex justify-center items-center py-2">
                    <section className="px-5 py-3 rounded-lg shadow-lg">
                        <p className="text-blue-500 bg-white text-xl md:text-2xl lg:text-3xl">
                            Your Registrations
                        </p>
                    </section>
                </section>
                <section className="py-2 px-4">
                    <section className='w-full overflow-x-auto  overflow-y-auto my-3'>
                        <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                            {/* Table header */}
                            <thead className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white'>
                                <tr>
                                    <td className='px-2 py-2 md:px-4'>Sr No</td>
                                    <td className='px-2 py-2 md:px-4'>Event Name</td>
                                    <td className='px-2 py-2 md:px-4'>Sub Event Name</td>
                                    <td className='px-2 py-2 md:px-4'>SID</td>
                                    <td className='px-2 py-2 md:px-4'>Name</td>
                                    <td className='px-2 py-2 md:px-4'>Course</td>
                                    <td className='px-2 py-2 md:px-4'>Semester</td>
                                    <td className='px-2 py-2 md:px-4'>Division</td>
                                    <td className='px-2 py-2 md:px-4'>Mobile No.</td>
                                    <td className='px-2 py-2 md:px-4'>Registration Date & Time.</td>
                                    <td className='px-2 py-2 md:px-4'>Request Status</td>
                                </tr>
                            </thead>
                            {/* Table body */}
                            <tbody>
                                {
                                    isLoading
                                        ?
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((event, eventIdx) => {
                                            return (
                                                <tr key={eventIdx}>

                                                    <td
                                                        className='border px-2 py-2 md:px-4 '
                                                    >
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td
                                                        className='border px-2 py-2 md:px-4 '
                                                    >
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td
                                                        className='border px-2 py-2 md:px-4 '
                                                    >
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>

                                                    <td className="border px-2 py-2 md:px-4">
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2 md:px-4">
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2 md:px-4">
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2 md:px-4">
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2 md:px-4">
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2 md:px-4">
                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2 md:px-4">

                                                        <Skeleton
                                                            count={1}
                                                            height="50%"
                                                            width="100%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />

                                                    </td>
                                                    <td className='border px-2 py-2 md:px-4'
                                                    >
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
                                            )
                                        })

                                        :
                                        registeredEvents?.length > 0 ?
                                            registeredEvents?.map((event, eventIdx) => {
                                                return (
                                                    event.studentData?.map((student, stdIdx) => {
                                                        return (
                                                            <tr key={event._id}>
                                                                {
                                                                    stdIdx === 0 &&
                                                                    <>
                                                                        <td
                                                                            className='border px-2 py-2 md:px-4 '
                                                                            rowSpan={event.studentData.length}>
                                                                            {
                                                                                eventIdx + 1
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            className='border px-2 py-2 md:px-4 '
                                                                            rowSpan={event.studentData.length}
                                                                        >
                                                                            {event.ename}
                                                                        </td>
                                                                        <td
                                                                            className='border px-2 py-2 md:px-4 '
                                                                            rowSpan={event.studentData.length}
                                                                        >
                                                                            {event?.subEventName ? event?.subEventName : "-"}
                                                                        </td>
                                                                    </>
                                                                }
                                                                <td className="border px-2 py-2 md:px-4">
                                                                    {
                                                                        student.sid
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-2 md:px-4">
                                                                    {

                                                                        student.studentName
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-2 md:px-4">
                                                                    {
                                                                        student.course.courseName
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-2 md:px-4">
                                                                    {
                                                                        student.semester
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-2 md:px-4">
                                                                    {
                                                                        student.division
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-2 md:px-4">
                                                                    {
                                                                        student.phno
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-2 md:px-4">

                                                                    {
                                                                        moment(event.createdAt).format("lll")
                                                                    }

                                                                </td>
                                                                {
                                                                    stdIdx === 0
                                                                    &&
                                                                    <td className='border px-2 py-2 md:px-4'
                                                                        rowSpan={event.studentData.length}
                                                                    >
                                                                        {
                                                                            event.status === "pending"
                                                                                ?
                                                                                <img src={PendingImage} className='w-10' alt="pending" />
                                                                                :
                                                                                event.status === "rejected"
                                                                                    ?
                                                                                    <img src={RejectedImage} className='w-10' alt="rejected" />
                                                                                    :
                                                                                    <img src={ApprovalImage} className='w-10' alt="approval" />
                                                                        }
                                                                    </td>
                                                                }
                                                            </tr>
                                                        )
                                                    })
                                                )

                                            })
                                            :
                                            <tr>
                                                <td
                                                    colSpan={11}
                                                    className='border px-2 py-2 md:px-4 text-center'
                                                >
                                                    You Have Not Participated in any Event Till Now.
                                                </td>
                                            </tr>
                                }
                            </tbody>
                        </table>
                    </section>

                </section>
            </section>
        </>
    )
}
