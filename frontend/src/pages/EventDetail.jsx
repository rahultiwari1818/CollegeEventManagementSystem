import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatMongoDate } from '../utils';
import { toast } from 'react-toastify';
import CancelEvent from '../components/CancelEvent';
import UpdateEvent from '../components/UpdateEvent';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';
import Overlay from '../components/Overlay';
import { ReactComponent as View } from "../assets/Icons/View.svg";
import Modal from '../components/Modal';
export default function EventDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isPageLoading,setIsPageLoading] = useState(true);
    const [dataUpdated, setDataUpdated] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openCancelCnfModal, setOpenCancelCnfModal] = useState(false);
    const userData = useSelector((state) => state.UserSlice);
    const [openDetailsModel, setOpenDetailsModel] = useState(false);
    const [subEventDataToShow, setSubEventDataToShow] = useState({});
    console.log(userData)



    const getEventDetails = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/events/getSpecificEvent/${id}`, {
                headers: {
                    "auth-token": token,
                }
            });
            if (data.data.length === 0) {
                navigate("/home");
            }
            setData(()=>data.data[0]);
            setIsLoading(() => false);
        } catch (error) {
            setData({});
            setIsLoading(() => false);
        }

    }




    const viewBrochure = () => {
        console.log("path",data.ebrochurePath)
        window.open(`${data?.ebrochurePath}`, "_blank")
    }

    const viewPoster = () => {
        window.open(`${data?.eposterPath}`, "_blank")
    }

    const handleRegisterEvent = () => {
        navigate(`/registerInEvent/${data?._id}`);
        
    }

    const handleSubEventRegister = (subEventId) =>{
        navigate(`/registerInEvent/${data?._id}/${subEventId}`);
    }

    const changeEventStatus = async (status) => {

        setIsLoading((old) => !old);

        const dataToUpdate = (status === "cancel") ?
            {
                isCanceled: true
            }
            :
            {
                isCanceled: false
            };

        try {

            const { data } = await axios.patch(`${API_URL}/api/events/changeEventStatus/${id}`,
                dataToUpdate
                , {
                    headers: {
                        "auth-token": token,
                    }
                }
            );
            toast.success(data.message);
        } catch (error) {

        }
        finally {

            setDataUpdated((old) => !old);
            setIsLoading((old) => !old);
        }



    }


    const viewSubEventDetails = (event) => {
        setOpenDetailsModel((old) => true);
        setSubEventDataToShow((old) => event);
    }


    // console.log(userData)

    const curDate = new Date();


    useEffect(() => {
        getEventDetails();
    }, [dataUpdated])

    useEffect(() => {
        setIsPageLoading(false);
    }, [])

    console.log(data)



    return (
        <>
            {
                isLoading
                &&
                <Overlay />
            }
            <section className='m-5'>
                <section className='flex justify-center items-center '>

                    <section className='shadow-xl overflow-auto rounded-xl w-[90vw] md:w-[70vw]  px-5 py-5'>
                        <section className="py-4">

                            <p className='text-3xl font-extrabold'>
                                {
                                    isLoading ?
                                        <Skeleton
                                            count={1}
                                            height="50%"
                                            width="50%"
                                            baseColor="#4299e1"
                                            highlightColor="#f7fafc"
                                            duration={0.9}
                                        />
                                        :
                                        data.ename
                                }
                            </p>
                        </section>
                        <section className='py-4'>


                            {
                                isLoading ?
                                    <Skeleton
                                        count={1}
                                        height="80%"
                                        width="50%"
                                        baseColor="#4299e1"
                                        highlightColor="#f7fafc"
                                        duration={0.9}
                                    />
                                    :
                                    data.isCanceled ?
                                    <p className='text-red-500'>Event Canceled</p>
                                    :
                                    curDate > new Date(data.edate)
                                        ?
                                        <p className='text-red-500'>Event Expired</p>
                                        :
                                        curDate <= new Date(data.rcdate)
                                            ?
                                            <p className='text-green-500'>Registration Open</p>
                                            :
                                            <p className='text-red-500'>Registration Closed</p>
                            }
                        </section>
                        <section className="my-2 ">
                            <p className="text-xl">Event Type :  {
                                isLoading ?
                                    <Skeleton
                                        count={1}
                                        height="100%"
                                        width="50%"
                                        baseColor="#4299e1"
                                        highlightColor="#f7fafc"
                                        duration={0.9}
                                    />
                                    :
                                    data.etype
                            }</p>
                        </section>
                        <section className="my-2 ">
                            <p className="text-xl">Event Date : {
                                isLoading ?
                                    <Skeleton
                                        count={1}
                                        height="100%"
                                        width="50%"
                                        baseColor="#4299e1"
                                        highlightColor="#f7fafc"
                                        duration={0.9}
                                    />
                                    :
                                    formatMongoDate(data.edate)}</p>
                        </section>
                        <section className="my-2 ">
                            <p className="text-xl text-red-500">Registration Closing Date : {
                                isLoading ?
                                    <Skeleton
                                        count={1}
                                        height="100%"
                                        width="50%"
                                        baseColor="#4299e1"
                                        highlightColor="#f7fafc"
                                        duration={0.9}
                                    />
                                    :
                                    formatMongoDate(data.rcdate)}</p>
                        </section>

                        {
                            data?.hasSubEvents
                                ?
                                <section className='my-2'>
                                    <table className="min-w-full bg-white border border-b border-blue-500">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b text-blue-500">Sr No</th>
                                                <th className="py-2 px-4 border-b text-blue-500">Sub Event Name</th>
                                                <th className="py-2 px-4 border-b text-blue-500">Participation Type</th>
                                                <th className="py-2 px-4 border-b text-blue-500">No Of Participant Allowed</th>
                                                <th className="py-2 px-4 border-b text-blue-500">View Details</th>
                                                {
                                                             !data.isCanceled && curDate <= new Date(data.rcdate)  && userData?.role === "Student" &&
                                                <th className="py-2 px-4 border-b text-blue-500">Register</th>
}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                isLoading
                                                    ?

                                                    [1, 2, 3].map((skeleton, idx) => {
                                                        return <tr key={idx}>
                                                            <td className="py-2 px-4 border-b"><Skeleton
                                                                count={1}
                                                                height="100%"
                                                                width="10%"
                                                                baseColor="#4299e1"
                                                                highlightColor="#f7fafc"
                                                                duration={0.9}
                                                            /></td>
                                                            <td className="py-2 px-4 border-b"><Skeleton
                                                                count={1}
                                                                height="100%"
                                                                width="30%"
                                                                baseColor="#4299e1"
                                                                highlightColor="#f7fafc"
                                                                duration={0.9}
                                                            /></td>
                                                            <td className="py-2 px-4 border-b"><Skeleton
                                                                count={1}
                                                                height="100%"
                                                                width="30%"
                                                                baseColor="#4299e1"
                                                                highlightColor="#f7fafc"
                                                                duration={0.9}
                                                            /></td>
                                                            <td className="py-2 px-4 border-b"><Skeleton
                                                                count={1}
                                                                height="100%"
                                                                width="30%"
                                                                baseColor="#4299e1"
                                                                highlightColor="#f7fafc"
                                                                duration={0.9}
                                                            /></td>
                                                        </tr>
                                                    })

                                                    :

                                                    data?.subEvents?.map((event, idx) => {
                                                        return <tr key={event.sId}>
                                                            <td className="py-2 px-4 border-b">{idx + 1}</td>
                                                            <td className="py-2 px-4 border-b">{event.subEventName}</td>
                                                            <td className="py-2 px-4 border-b">{event.ptype}</td>
                                                            <td className="py-2 px-4 border-b">{event.noOfParticipants}</td>
                                                            <td className="py-2 px-4 border-b"><View className="cursor-pointer" onClick={() => viewSubEventDetails(event)} /></td>
                                                            {
                                                             !data.isCanceled && curDate <= new Date(data.rcdate)  && userData?.role === "Student" &&
                                                            <td className="py-2 px-4 border-b">

                                                                <button
                                                                    className='px-5 py-3 bg-blue-500 rounded-lg shadow-lg text-white hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500'
                                                                    onClick={()=>handleSubEventRegister(event?.sId)}

                                                                >
                                                                    Register
                                                                </button>
                                                           </td>
                                                    }
                                                        </tr>
                                                    })
                                            }
                                        </tbody>
                                    </table>
                                </section>
                                :

                                <section className="my-2 ">
                                    <table className="min-w-full bg-white border border-b border-blue-500">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b text-blue-500">Participation Type</th>

                                                <th className="py-2 px-4 border-b text-blue-500">Max No of Allowed Participant Per Team</th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-2 px-4 border-b">{
                                                    isLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="100%"
                                                            width="50%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        <p className='text-center'>
                                                      {  data.ptype}
                                                        </p>

                                                        
                                                        }
                                                        </td>
                                                

                                                    <td className="py-2 px-4 border-b">{
                                                        isLoading ?
                                                            <Skeleton
                                                                count={1}
                                                                height="100%"
                                                                width="50%"
                                                                baseColor="#4299e1"
                                                                highlightColor="#f7fafc"
                                                                duration={0.9}
                                                            />
                                                            :
                                                            <p className="text-center">
                                                                {data.noOfParticipants}
                                                            </p>
                                                            
                                                            }
                                                    </td>
                                                

                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                        }

                        <section className="my-2 py-2">
                            <p className='text-xl'>Event Details:</p>
                            <p className="text-lg my-2 shadow-xl rounded-xl px-2 py-2">{
                                isLoading ?
                                    <Skeleton
                                        count={3}
                                        height="100%"
                                        width="80%"
                                        baseColor="#4299e1"
                                        highlightColor="#f7fafc"
                                        duration={0.9}
                                    />
                                    :
                                    (data.edetails)}</p>
                        </section>
                        <section className="my-2 py-2">
                            <p className='text-xl'>Event Rules:</p>
                            <p className="text-lg my-2 shadow-xl rounded-xl px-2 py-2">{
                                isLoading ?
                                    <Skeleton
                                        count={3}
                                        height="100%"
                                        width="80%"
                                        baseColor="#4299e1"
                                        highlightColor="#f7fafc"
                                        duration={0.9}
                                    />
                                    :
                                    (data.rules)}</p>
                        </section>

                        <section className="my-2 py-2">

                            {
                                data?.ebrochurePath && data.ebrochurePath !== "" &&
                                <button
                                    className='mx-4 px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                    onClick={viewBrochure}
                                >
                                    View Brochure
                                </button>
                            }
                            {
                               data?.eposterPath && data?.eposterPath !== "" &&
                                <button
                                    className='mx-4 my-2 px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                    onClick={viewPoster}
                                >
                                    View Poster
                                </button>
                            }
                        </section>



                        {

                        }


                        {/* Conditional Rendering  for Participants -- where user is not admin */}
                        {
                            (!data?.hasSubEvents && !data.isCanceled && curDate <= new Date(data.rcdate) && userData?.role === "Student") &&
                            <section className="my-2 py-2">
                                <button
                                    className='px-5 py-3 bg-blue-500 rounded-lg shadow-lg text-white hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500'
                                    onClick={handleRegisterEvent}

                                >
                                    Register
                                </button>
                            </section>
                        }


                        {/* Conditional Rendering for Admins */}
                        {
                            (userData.role === "Admin" || userData.role === "Super Admin") &&
                            <section className="my-2 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">

                                <section className='my-2'>

                                    <button
                                        className=' px-5 py-3 bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                                        onClick={setOpenUpdateModal}>
                                        Update
                                    </button>
                                </section>
                                <section className='my-2'>

                                    <button
                                        className=' px-5 py-3 bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                                        onClick={()=>{
                                            navigate(`/viewRegistrations/${data?._id}`);
                                        }}>
                                        View Participation
                                    </button>
                                </section>
                            
                            {
                                // curDate >= new Date(data.edate)
                                true
                                &&
                                <section className='my-2'>
                                    <button
                                        className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                        onClick={()=>{
                                            navigate(`/declareResult/${data?._id}`)
                                        }}
                                    >
                                        Declare Result
                                    </button>
                                </section>
                            }


                                {/* to cancel event */}
                                {(!data.isCanceled) &&

                                    <section className='my-2'>
                                        <button
                                            className='px-5 py-3 bg-red-500 rounded-lg shadow-lg text-white hover:text-red-500 hover:bg-white hover:outline hover:outline-red-500'
                                            onClick={setOpenCancelCnfModal}
                                        >
                                            Cancel  Event
                                        </button>
                                    </section>
                                }
                                {/* to activate event */}
                                {
                                    (data.isCanceled) &&


                                    <section className='my-2'>
                                        <button
                                            className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                            onClick={() => {
                                                changeEventStatus("activate");
                                            }}
                                        >
                                            Activate  Event
                                        </button>
                                    </section>
                                }
                            </section>

                        }



                    </section>
                </section>
            </section>

            <UpdateEvent openUpdateModal={openUpdateModal} setOpenUpdateModal={setOpenUpdateModal} dataToUpdate={data} setDataUpdated={setDataUpdated} />
            <CancelEvent openCancelCnfModal={openCancelCnfModal} setOpenCancelCnfModal={setOpenCancelCnfModal} changeEventStatus={changeEventStatus} />
            <ViewSubEventDetails openDetailsModel={openDetailsModel} setOpenDetailsModel={setOpenDetailsModel} eventData={subEventDataToShow} />
        </>
    )
}


const ViewSubEventDetails = ({ openDetailsModel, setOpenDetailsModel, eventData }) => {
    // console.log(openDetailsModel,setOpenDetailsModel,eventData,"cl")
    return (
        <Modal isOpen={openDetailsModel} close={setOpenDetailsModel} heading={"Details of Sub Event"}>
            <section className='px-5 py-4'>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="ename">Event Name:</label>
                    <output
                        className='w-full block  shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                    >{eventData.subEventName}</output>
                </section>

                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="ptype">Participation Type:</label>
                    <output
                        className='w-full block  shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                    >{eventData.ptype}</output>
                </section>

                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="nop">Max No Of Team Members:</label>
                    <output
                        className='block shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                    >{eventData.noOfParticipants}</output>
                </section>

                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="details">Event Details:</label><br />
                    <output
                        className='w-full block  shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                    >{eventData.subEventDetail}</output>
                </section>

                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="rules">Rules For Events:</label><br />
                    <output
                        className='w-full  block shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                    >{eventData.subEventRules}</output>
                </section>
            </section>
        </Modal>
    )
}
