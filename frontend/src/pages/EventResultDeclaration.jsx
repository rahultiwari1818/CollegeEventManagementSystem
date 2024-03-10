import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Overlay from '../components/Overlay'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/Dropdown';
import { transformCourseData, transformSubEventData } from '../utils';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

export default function EventResultDeclaration() {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const [searchParams, setSearchParams] = useState({
        sId: 0,
        course: ""
    })
    const [eventData, setEventData] = useState([]);
    const [subEvents, setSubEvents] = useState([]);
    const [eventRegistrations, setEventRegistrations] = useState([]);
    const [eligibleCourses, setEligibleCourses] = useState([]);
    const [subEventRegistrations, setSubEventRegistrations] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showOverLay, setShowOverLay] = useState(true)
    const [isOpenDeclareResultModal, setIsOpenDeclareResultModal] = useState(false);
    const [fetchDataAgain, setFetchDataAgain] = useState(false);
    const [resultDeclared,setResultDeclared] = useState(false);
    const userData = useSelector((state) => state.UserSlice);

    const navigate = useNavigate();

    const { eventId } = useParams();

    const updateSid = useCallback((value) => {
        setSearchParams((old) => ({ ...old, sId: value }))
    }, [])

    const updateCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, course: value }))
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

    const changefetchDataAgain = () => {
        setFetchDataAgain((old) => !old);
    }


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
                    // console.log(data.data.eligibleCourses)
                    setEligibleCourses(() => transformCourseData(data.data.eligibleCourses))
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
        setSearchParams({
            sId: 0,
            course: ""
        })
    }, [fetchDataAgain])



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
        const dragIdx = event.dataTransfer.getData("text/idx");
        const updateFilteredData = [...filteredData];
        const draggedTeam = updateFilteredData.splice(dragIdx, 1)[0];
        updateFilteredData.splice(dropIdx, 0, draggedTeam);
        setFilteredData(updateFilteredData);
    };


    const handleDragOver = (event) => {
        event.preventDefault();
    };


    const openDeclareResultModal = () => {

        setIsOpenDeclareResultModal(true);
    }

    const closeDeclareResultModal = () => {
        setIsOpenDeclareResultModal(false);

    }

    useEffect(() => {
        if (eventData.hasSubEvents && eventData.courseWiseResultDeclaration) {
            // Filter data based on both subevent selection (searchParams.sId) and course selection (searchParams.course)
            const data = subEventRegistrations.filter(team => team.sId == searchParams.sId) // Filter subevents based on selected subevent
            const courseWiseTeams = data.map(team => team.studentData[0].course._id == searchParams.course ? team : {});
            const filteredTeams = courseWiseTeams.filter(team => team._id) || [];
            const isResultDeclared = filteredTeams.find((team)=>team.rank>0)||null;
            if(isResultDeclared){
                setResultDeclared(true);
            }
            else{
                setResultDeclared(false);
            }
            setFilteredData((old) => (filteredTeams));

        } else if (eventData.hasSubEvents) {
            // Filter data based on subevent selection only (searchParams.sId)
            const data = subEventRegistrations.filter(team => team.sId == searchParams.sId);
            const isResultDeclared = data.find((team)=>team.rank>0)||null;
            if(isResultDeclared){
                setResultDeclared(true);
            }
            else{
                setResultDeclared(false);
            }
            setFilteredData((old) => (data));
        } else if (eventData.courseWiseResultDeclaration) {
            // Filter data based on course selection only (searchParams.course)
            const data = eventRegistrations.map((team) => {
                return team.studentData[0].course._id == searchParams.course ? team : {};
            })
            const filteredData = data.filter((team) => team._id);
            const isResultDeclared = filteredData.find((team)=>team.rank>0)||null;
            if(isResultDeclared){
                setResultDeclared(true);
            }
            else{
                setResultDeclared(false);
            }
            setFilteredData((old) => (filteredData));
        } else {
            // No specific filters applied, return all data
            const isResultDeclared = eventRegistrations.find((team)=>team.rank>0)||null;
            if(isResultDeclared){
                setResultDeclared(true);
            }
            else{
                setResultDeclared(false);
            }
            setFilteredData((old) => (eventRegistrations));
        }
    }, [eventData, eventRegistrations, subEventRegistrations, searchParams])

    return (
        <>
            {
                showOverLay
                &&
                <Overlay />
            }
            <section className='my-2 px-2 py-2'>
                <p className="text-lg my-2 text-center bg-red-500 text-white py-1">
                    Just Drag the Participant to the Specified Position for Ranking
                </p>
                {
                    !eventData?.hasSubEvents
                        ?

                        <p className=' text-base md:text-lg text-center text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-1'>
                            Participants of {eventData.ename}
                        </p>
                        :
                        <section className='text-base md:text-lg  text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-1 grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                    <section className='my-2 text-base md:text-lg  text-white bg-gradient-to-r from-cyan-500 to-blue-500  p-1 grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                            <thead className="bg-gradient-to-r from-cyan-500 to-blue-500  text-white">
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
                                    filteredData.length === 0 ?
                                        <tr>
                                            <td colSpan={8} className='text-center px-2 py-2 md:px-4 '>
                                                No Data Found
                                            </td>
                                        </tr>
                                        :

                                            resultDeclared
                                            ?
                                            <tr>
                                                <td colSpan={8} className='text-center px-2 py-2 md:px-4 '>
                                                    Results are Already Declared
                                                </td>
                                            </tr>
                                            :

                                            filteredData.map((team, idx) => {
                                                return (
                                                    team.studentData.map((student, stdIdx) => (
                                                        <tr key={stdIdx} className='cursor-grab drag-start:border ' draggable onDragStart={(e) => handleDragStart(e, team._id, idx)} onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, team._id, idx)}>
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
                                                    ))
                                                )
                                            })}


                            </tbody>
                        </table>
                    </section>
                    <section className="my-2">
                        {
                            filteredData.length > 0
                                ?
                                resultDeclared
                                    ?

                                    <>
                                    </>
                                    :
                                    <button
                                        className='text-yellow-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-yellow-500 hover:text-white hover:bg-yellow-500 '
                                        onClick={openDeclareResultModal}
                                    >
                                        Complete Result Declaration
                                    </button>

                                :
                                <>
                                </>
                        }
                    </section>
                </section>
            </section>
            <ConfirmationModal isOpen={isOpenDeclareResultModal} close={closeDeclareResultModal} filteredData={filteredData.slice(0, 3)} searchParams={searchParams} eventData={eventData} changefetchDataAgain={changefetchDataAgain} />
        </>
    )
}

const ConfirmationModal = ({ isOpen, close, filteredData, searchParams, eventData, changefetchDataAgain }) => {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const subEvent = eventData.subEvents?.find((event) => event.sId === searchParams.sId);
    const course = eventData.eligibleCourses?.find((course) => course._id == searchParams.course)


    const declareResults = async () => {
        try {
            const teamIds = filteredData.slice(0, 3).map((team) => team._id);
            const dataToPost = {
                teamIds: teamIds,
            }
            const { data } = await axios.post(`${API_URL}/api/events/declareResult/${eventData._id}`, dataToPost, {
                headers: {
                    "auth-token": token,
                }
            })

            if (data?.result) {
                toast.success(data.message);
                close();
                changefetchDataAgain()
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal isOpen={isOpen} close={close} heading={"Confirm Details"}>
            <section className="my-2">
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <p className=" text-blue-500 text-xl border-b border-blue-500 py-2">
                        <span className="mx-2">
                            Event Name :
                        </span>
                        {
                            eventData?.ename
                        }
                    </p>
                    {
                        eventData?.hasSubEvents &&
                        <p className=" text-lg text-blue-500 border-b border-blue-500 py-2">
                            <span className="mx-2">
                                Sub Event Name :
                            </span>
                            {
                                subEvent?.subEventName
                            }
                        </p>
                    }{
                        eventData?.courseWiseResultDeclaration &&
                        <p className=" text-lg text-blue-500 border-b border-blue-500 py-2">
                            <span className="mx-2">
                                Course:
                            </span>
                            {
                                course?.courseName
                            }
                        </p>
                    }
                </section>
                <section className="my-2">
                    <p className="text-xl py-2 text-center font-bold text-blue-500">
                        Top {filteredData.length} Participants
                    </p>
                    <section className="overflow-x-auto  overflow-y-auto border border-blue-500 border-solid rounded-t-lg">
                        <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                            <thead className="bg-gradient-to-r from-cyan-500 to-blue-500  text-white">
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

                                {filteredData?.map((team, idx) => {
                                    return (
                                        team.studentData.map((student, stdIdx) => (
                                            <tr key={stdIdx}  >
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
                                        ))
                                    )
                                })}


                            </tbody>
                        </table>
                    </section>
                    <section className="grid grid-cols-2 gap-5 my-3 py-2">
                        <button
                            onClick={() => { close() }}
                            className='text-yellow-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-yellow-500 hover:text-white hover:bg-yellow-500 '
                        >
                            Edit Results
                        </button>
                        <button
                            className='text-red-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 '
                            onClick={declareResults}
                        >Declare Results</button>
                    </section>
                </section>
            </section>
        </Modal>
    )
}