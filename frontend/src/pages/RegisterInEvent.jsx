import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Overlay from '../components/Overlay';
import { useSelector } from 'react-redux';
import ParticipantDetail from '../components/ParticipantDetail';

export default function RegisterInEvent() {
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [eventData, setEventData] = useState({});
    const [studentData,setStudentData] = useState({});
    const [isPageLoading,setIsPageLoading] = useState(true);
    const params = useParams();
    const eventId = params.eid;
    const subEventId = params.sid;

    const userId = useSelector((state)=>state.UserSlice._id);

    const findStudentData = async () => {
        if(!userId) return;
        try {
            const { data } = await axios.get(`${API_URL}/api/students/getSpecificStudents/${userId}`, {
                headers: {
                    "auth-token": token,
                }
            });

            setStudentData(data.data);

        } catch (error) {

        }
    };

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/events/getSpecificEvent/${eventId}`, {
                    headers: {
                        "auth-token": token,
                    }
                });
                if(data.result){
                    if (data?.data?.hasSubEvents) {
                        const subEvents = data.data.subEvents;
                        const [subEventData] = subEvents.filter((event) => event.sId === Number(subEventId));
                        setEventData({ eventId: data.data._id,
                            ename:data.data.ename,
                            hasSubEvents:data.data.hasSubEvents,
                            etype:data.data.etype,
                            ...subEventData });
                    }
                    else {
                        setEventData(data?.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
            finally{
                setIsPageLoading(false)
            }
        };
        fetchEventData();
    }, [eventId, subEventId, token, API_URL]);

    useEffect(() => {
        findStudentData();
    }, [userId])

    return (
        <>
            {isPageLoading && <Overlay />}
            
            <section className='flex justify-center items-center mt-5'>
                <section className='p-5 md:p-10 shadow-lg bg-white border  border-blue-500 md:mt-0 md:mb-0  w-full max-w-4xl '>
                    <p className='text-base md:text-2xl text-center text-white bg-blue-500 p-2'>Registration Form</p>
                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <ParticipantDetail noOfParticipants={eventData?.noOfParticipants} studentData={studentData}  eventData={eventData}/>
                        </section>
                </section>
            </section>
        </>
    );
}
