import React, { useCallback, useEffect, useState } from 'react'
import Modal from './Modal'
import axios from 'axios';
import { transformCourseData } from '../utils';
import Dropdown from './Dropdown';

export default function ViewResultsModal({ isOpen, close, eventData, courses }) {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [registrationData, setRegistrationData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [eligibleCourses, setEligibleCourses] = useState([]);



    const [filterParams, setFilterParams] = useState({
        courseId: ""
    })

    const changeFilterCourse = useCallback((value) => {
        setFilterParams((old) => ({ ...old, courseId: value }))
    }, [])


    useEffect(() => {

        if (!eventData?.ename) {
            return;
        }

        const fetchRegistrationDetails = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/events/${eventData._id}/getResults`, {
                    params: {
                        hasSubEvents: eventData?.hasSubEvents,
                        courseWiseResultDeclaration: eventData?.courseWiseResultDeclaration
                    },
                    headers: {
                        "auth-token": token
                    }
                });

                if (data.result) {
                    setRegistrationData(data?.data)
                }

            } catch (error) {
                // Handle error
                console.log(error);
                setRegistrationData([]);
            }


        };

        fetchRegistrationDetails();
        setEligibleCourses(transformCourseData(courses));


    }, [eventData, courses])

    useEffect(() => {
        if (!eventData.courseWiseResultDeclaration) {
            setFilteredData(registrationData);
            return;
        }
        if (filterParams.courseId === "") {
            setFilteredData([]);
        }
        else {
            const courseData = registrationData.find(course => course.courseId === filterParams.courseId) || [];
            setFilteredData(courseData)
        }
    }, [registrationData, filterParams.courseId])



    console.log("filteredData", filteredData)

    return (
        <Modal isOpen={isOpen} close={close} heading={"View Results"} >
            <p className=" py-2 text-center text-white bg-gradient-to-r from-cyan-500 to-blue-500">
                Results of {eventData?.ename}
            </p>
            <section className='my-2 py-2 px-2 min-h-[40vh]'>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b pb-2">
                    {
                        eventData.courseWiseResultDeclaration &&
                        <Dropdown dataArr={eligibleCourses} selected={filterParams.courseId} setSelected={changeFilterCourse} name="searchCourse" label="Select Course" passedId={true} />
                    }

                </section>
                <section className="my-2">

                    {
                        eventData.hasSubEvents ? (

                            (!eventData.courseWiseResultDeclaration)
                                ?
                                filteredData.length === 0
                                    ?
                                    <section className="my-2">
                                        <p className="text-center py-2">
                                            Results Are Not Declared.
                                        </p>
                                    </section>
                                    :

                                    filteredData?.map((subEvent) => {
                                        return (
                                            <section key={subEvent.sId} className='my-3 border border-blue-500 py-3 px-3 shadow-lg' >
                                                <p className=' text-base md:text-lg text-center text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-2'>
                                                    Results of {subEvent.results?.at(0).subEventName}
                                                </p>
                                                <section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                                                    <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                                        {/* Table header */}
                                                        <thead className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white'>
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
                                                        {/* Table body */}
                                                        <tbody>
                                                            {subEvent.results?.map((studentTeam, teamIdx) => {
                                                                return (
                                                                    studentTeam.studentData?.map((team, idx) => {
                                                                        return (
                                                                            <tr key={idx}>
                                                                                {/* Table cells */}
                                                                                {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>{teamIdx + 1}</td>}
                                                                                {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>{studentTeam.rank}</td>}
                                                                                <td className='border px-2 py-2 md:px-4 '>{team.sid}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{team.studentName}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{team.course.courseName}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{team.semester}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{team.division}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{team.phno}</td>

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


                                    })

                                :

                                (filteredData.length === 0 && filterParams.courseId === "")
                                    ?
                                    <section className="my-2">
                                        <p className="text-center py-2">
                                            Select a course to view Result.
                                        </p>
                                    </section>
                                    :


                                    filteredData.length === 0
                                        ?
                                        <section className="my-2">
                                            <p className="text-center py-2">
                                                No Data Found.
                                            </p>
                                        </section>
                                        :




                                            filteredData?.subEvents?.map((subEvent) => {
                                                return (
                                                    <section key={subEvent.sId} className='my-3 border border-blue-500 py-3 px-3 shadow-lg' >
                                                        <p className=' text-base md:text-lg text-center text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-2'>
                                                            Results of {subEvent.subEventName}
                                                        </p>
                                                        <section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                                                            <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                                                {/* Table header */}
                                                                <thead className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white'>
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
                                                                {/* Table body */}
                                                                <tbody>
                                                                    {subEvent.results?.map((studentTeam, teamIdx) => {
                                                                        return (
                                                                            studentTeam.studentData?.map((team, idx) => {
                                                                                return (
                                                                                    <tr key={idx}>
                                                                                        {/* Table cells */}
                                                                                        {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>{teamIdx + 1}</td>}
                                                                                        {idx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>{studentTeam.rank}</td>}
                                                                                        <td className='border px-2 py-2 md:px-4 '>{team.sid}</td>
                                                                                        <td className='border px-2 py-2 md:px-4 '>{team.studentName}</td>
                                                                                        <td className='border px-2 py-2 md:px-4 '>{team.course.courseName}</td>
                                                                                        <td className='border px-2 py-2 md:px-4 '>{team.semester}</td>
                                                                                        <td className='border px-2 py-2 md:px-4 '>{team.division}</td>
                                                                                        <td className='border px-2 py-2 md:px-4 '>{team.phno}</td>

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


                                            })
                        ) : (


                            <section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                                <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                    {/* Table header */}
                                    <thead className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white'>
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
                                    {/* Table body */}
                                    <tbody>
                                        {


                                            (!eventData.courseWiseResultDeclaration)
                                                ?

                                                filteredData.length === 0
                                                    ?
                                                    <tr className=" py-2">
                                                        <td className='text-center' colSpan={7}>

                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                    :

                                                    filteredData?.map((team, idx) => (
                                                        team.studentData?.map((studentTeam, teamIdx) => {
                                                            return (
                                                                <tr key={teamIdx}>
                                                                    {/* Table cells */}
                                                                    {teamIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={team.studentData.length}>{idx + 1}</td>}
                                                                    {teamIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={team.studentData.length}>{team.rank}</td>}
                                                                    <td className='border px-2 py-2 md:px-4 '>{studentTeam.sid}</td>
                                                                    <td className='border px-2 py-2 md:px-4 '>{studentTeam.studentName}</td>
                                                                    <td className='border px-2 py-2 md:px-4 '>{studentTeam.course.courseName}</td>
                                                                    <td className='border px-2 py-2 md:px-4 '>{studentTeam.semester}</td>
                                                                    <td className='border px-2 py-2 md:px-4 '>{studentTeam.division}</td>
                                                                    <td className='border px-2 py-2 md:px-4 '>{studentTeam.phno}</td>

                                                                </tr>
                                                            );
                                                        })
                                                    ))
                                                :

                                                (  filteredData.length === 0 && filterParams.courseId === "")
                                                    ?
                                                    <tr className="my-2">
                                                        <td className="text-center py-2" colSpan={7}>
                                                            Select a course to view Result.
                                                        </td>
                                                    </tr>
                                                    :


                                                    filteredData.length === 0
                                                        ?
                                                        <tr className=" py-2">
                                                            <td className='text-center' colSpan={7}>

                                                                No Data Found
                                                            </td>
                                                        </tr>
                                                        :


                                                        (!filteredData?.results) ?
                                                            <tr className=" py-2">
                                                                <td className='text-center' colSpan={7}>

                                                                    No Data Found
                                                                </td>
                                                            </tr>
                                                            :

                                                            filteredData.results?.map((teams, idx) => {

                                                                return (
                                                                    teams.studentData?.map((studentTeam, teamIdx) => {
                                                                        return (
                                                                            <tr key={teamIdx}>
                                                                                {/* Table cells */}
                                                                                {teamIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={teams.studentData.length}>{idx + 1}</td>}
                                                                                {teamIdx === 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={teams.studentData.length}>{teams.rank}</td>}
                                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.sid}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.studentName}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.course.courseName}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.semester}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.division}</td>
                                                                                <td className='border px-2 py-2 md:px-4 '>{studentTeam.phno}</td>

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
        </Modal>
    )
}
