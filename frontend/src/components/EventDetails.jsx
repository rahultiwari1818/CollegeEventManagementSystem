import axios from 'axios'
import React, { useEffect , useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatMongoDate } from '../utils';
import { toast } from 'react-toastify';
import CancelEvent from './CancelEvent';
import UpdateEvent from './UpdateEvent';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';
export default function EventDetails() {

    const { id } = useParams();

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [dataUpdated, setDataUpdated] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openCancelCnfModal, setOpenCancelCnfModal] = useState(false);
    const navigate = useNavigate();
    const userData = useSelector((state)=>state.UserSlice);

    console.log(userData)



    const getEventDetails = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/events/getSpecificEvent/${id}`,{
                headers:{
                    "auth-token":token,
                }
            });
            setData(data.data[0]);
        } catch (error) {
            setData({});
        }
        finally {
            setIsLoading(() => false);
        }

    }




    const viewBrochure = () => {
        window.open(`${API_URL}/${data.ebrochurePath}`, "_blank")
    }

    const redirectToRegister = () => {

    }

    const changeEventStatus = async (status) => {
        
        setIsLoading((old)=>!old);

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
                ,{
                    headers:{
                        "token":token,
                    }
                }
            );
            toast.success(data.message);
        } catch (error) {

        }
        finally {
       
            setDataUpdated((old)=>!old);
            setIsLoading((old)=>!old);
        }



    }





    console.log(data)

    const curDate = new Date();


    useEffect(() => {
        getEventDetails();
    }, [dataUpdated])

    useEffect(()=>{
        if(!userData.isLoggedIn) navigate("/login");
    },[userData])


    return (
        <>
            <section className='m-5'>
                <section className='flex justify-center items-center '>

                    <section className='shadow-xl overflow-auto rounded-xl w-[90vw] md:w-[70vw] lg:w-[50vw] px-5 py-5'>
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
                                                data.ptype}</td>
                                        {

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
                                                    data.noOfParticipants}</td>
                                        }

                                    </tr>
                                </tbody>
                            </table>
                        </section>
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
                          decodeURIComponent(  data.edetails)}</p>
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
                           decodeURIComponent( data.rules)}</p>
                        </section>
                        <section className="my-2 py-2">
                            <button
                                className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                onClick={viewBrochure}
                            >
                                View Brochure
                            </button>
                        </section>


                        {/* Conditional Rendering  for Participants -- where user is not admin */}
                        {
                            (true && !data.isCanceled && curDate <= new Date(data.rcdate)) &&
                            <section className="my-2 py-2">
                                <button
                                    className='px-5 py-3 bg-blue-500 rounded-lg shadow-lg text-white hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500'
                                    onClick={redirectToRegister}

                                >
                                    Register
                                </button>
                            </section>
                        }


                        {/* Conditional Rendering for Admins */}
                        {
                            (userData.role === "Admin" || userData.role === "Super Admin") &&
                            <section className="my-2 py-2 block  md:flex justify-around  items-center">
                                
                                    <section className='my-2'>

                                        <button
                                            className=' px-5 py-3 bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                                            onClick={setOpenUpdateModal}>
                                            Update
                                        </button>
                                    </section>
                                

                                <section className='my-2'>
                                    <button
                                        className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                    // onClick={setOpenCancelCnfModal}
                                    >
                                        Declare Result
                                    </button>
                                </section>

                                {/* to cancel event */}
                                {( !data.isCanceled) &&

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

            <UpdateEvent openUpdateModal={openUpdateModal} setOpenUpdateModal={setOpenUpdateModal} dataToUpdate={data} setDataUpdated={setDataUpdated}/>
            <CancelEvent openCancelCnfModal={openCancelCnfModal} setOpenCancelCnfModal={setOpenCancelCnfModal} changeEventStatus={changeEventStatus} />
        </>
    )
}
