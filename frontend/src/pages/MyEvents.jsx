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
import Dropdown from '../components/Dropdown';

export default function MyEvents() {


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOverLay, setShowOverLay] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10); // State for selected entries per page
    const [totalEntries, setTotalEntries] = useState(0); // State for total number of entries

    const user = useSelector((state) => state.UserSlice);
    const navigate = useNavigate();

    const fetchStudentEventData = async () => {
        
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${API_URL}/api/events/studentParticipatedEvents/${user._id}`, {
                params:{
                    page:currentPage,
                    perPage:entriesPerPage,
                },
                headers: {
                    "auth-token": token,
                }
            })
            if (data.result) {

                setRegisteredEvents((old)=>data?.data);
                setTotalEntries(data?.totalCount);
                setTotalPages(data?.totalPages);
            }

        } catch (error) {

            console.log(error)
            setRegisteredEvents([])
        }
        finally {
            setIsLoading(false)
        }

    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSelectedPage(page); // Update the selected page number
    };

    const handleSelectedPageChange = (selectedPage) => {
        setSelectedPage(selectedPage);
        setCurrentPage(selectedPage);
    };

    const handleEntriesPerPageChange = (value) => {
        setEntriesPerPage(value);
        setCurrentPage(1); // Reset current page when entries per page changes
    };
    const getStartIndex = () => {
        return (currentPage - 1) * entriesPerPage + 1;
    };

    const getEndIndex = () => {
        const endIndex = currentPage * entriesPerPage;
        return Math.min(endIndex, totalEntries);
    };

    useEffect(()=>{
        if (!user || user?.role === "" || user?.role === undefined) return;
        fetchStudentEventData();
    },[user,currentPage,entriesPerPage])


    useEffect(() => {
        if (!user || user?.role === "" || user?.role === undefined) return;
        if (user.role !== "Student") {
            navigate("/home");
        }


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

                <section className="overflow-x-auto max-h-[57vh] overflow-y-auto border border-blue-500 border-solid rounded-t-lg">
                    <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                        <thead className="bg-gradient-to-r from-cyan-500 to-blue-500  text-white">
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
                                                                            {event.eventId.ename}
                                                                        </td>
                                                                        <td
                                                                            className='border px-2 py-2 md:px-4 '
                                                                            rowSpan={event.studentData.length}
                                                                        >
                                                                            {event?.sId ? event?.eventId.subEvents.find(sub=>sub.sId==event.sId).subEventName : "-"}
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
                                                                {
                                                                    stdIdx === 0 &&
                                                                    <>
                                                                        <td
                                                                            className='border px-2 py-2 md:px-4 '
                                                                            rowSpan={event.studentData.length}>

                                                                            {
                                                                                moment(event.createdAt).format("lll")
                                                                            }

                                                                        </td>

                                                                    </>
                                                                }
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

                    <section className='md:flex justify-between items-center gap-5 '>
                        <section className='flex justify-between items-center'>
                            <p className='text-nowrap mx-2'>No of Entries : </p>
                            <Dropdown
                                dataArr={[{ name: 10 }, { name: 20 }, { name: 30 }]} // Options for entries per page
                                selected={entriesPerPage}
                                setSelected={(value) => handleEntriesPerPageChange(Number(value))} // Convert value to number before setting
                                name="entriesPerPage"
                                label="Entries Per Page"
                            />
                        </section>
                        <section>
                            {totalEntries > 0 && (
                                <p className=" text-nowrap my-3">
                                    Showing {getStartIndex()} - {getEndIndex()} of {totalEntries} Entries
                                </p>
                            )}
                        </section>
                        <section className="flex justify-center gap-3 mt-4 md:w-[30vw] float-right pb-8">
                            <button
                                className={`mx-1 px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500  text-white cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-500     hover:outline hover:outline-blue-500 text-white'}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <Dropdown
                                dataArr={Array.from({ length: totalPages }, (_, idx) => ({ name: idx + 1 }))}
                                selected={selectedPage}
                                setSelected={handleSelectedPageChange}
                                name="pageDropdown"
                                label="Go to Page"
                            />

                            <button
                                className={`mx-1 px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gradient-to-r from-cyan-500 to-blue-500  text-white cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-500     hover:outline hover:outline-blue-500 text-white'}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </section>
                    </section>

                </section>
            </section>
        </>
    )
}
