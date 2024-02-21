import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Overlay from '../components/Overlay';
import { handleNumericInput } from '../utils';
import { useSelector } from 'react-redux';

export default function RegisterInEvent() {
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [eventData, setEventData] = useState({});
    const [isPageLoading, setIsPageLoading] = useState(true);

    const params = useParams();
    const eventId = params.eid;
    const subEventId = params.sid;

    const userId = useSelector((state)=>state.UserSlice._id);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        // Add your submission logic here
    };

    const findStudentData = async () => {
        console.log(userId)
        if(!userId) return;
        try {
            const { data } = await axios.get(`${API_URL}/api/students/getSpecificStudents/${userId}`, {
                headers: {
                    "auth-token": token,
                }
            });

            console.log(data)

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
                if (data?.data[0]?.hasSubEvents) {
                    const subEvents = data.data[0].subEvents;
                    const [subEventData] = subEvents.filter((event) => event.sId == subEventId);
                    setEventData({ eventId: data.data[0]._id, ...subEventData });
                }
                else {
                    setEventData(data?.data[0]);
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };
        fetchEventData();
    }, [eventId, subEventId, token, API_URL]);

    useEffect(() => {
        setIsPageLoading(false);
    }, []);

    useEffect(()=>{
        findStudentData();

    },[userId])


    return (
        <>
            {isPageLoading && <Overlay />}

            <section className='flex justify-center items-center'>
                <section className='p-5 md:p-10 shadow-2xl bg-white md:outline-none outline outline-blue-500 md:mt-0 md:mb-0 mt-2 w-full max-w-4xl'>
                    <p className='text-2xl text-center text-white bg-blue-500 p-2'>Registration Form</p>
                    <form method="post" onSubmit={onSubmitHandler}>
                        <section className='md:p-2 md:m-2 p-1 m-1'>

                        </section>
                        <section className='md:p-2 md:m-2 p-1 m-1'>
                            <input type="submit" value="Generate Event" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                        </section>
                    </form>
                </section>
            </section>
        </>
    );
}
