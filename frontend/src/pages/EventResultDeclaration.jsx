import React, { useCallback, useEffect, useState } from 'react'
import Overlay from '../components/Overlay'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/Dropdown';
import { transformSubEventData } from '../utils';

export default function EventResultDeclaration() {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const [searchParams, setSearchParams] = useState({
        sId: 0
    })
    const [eventData, setEventData] = useState([]);
    const [subEvents, setSubEvents] = useState([]);
    const [eventRegistrations, setEventRegistrations] = useState([]);
    const [showOverLay, setShowOverLay] = useState(true)
    const userData = useSelector((state) => state.UserSlice);
    const navigate = useNavigate();

    const { eventId } = useParams();

    const updateSid = useCallback((value) => {
        setSearchParams((old) => ({ ...old, sId: value }))
    }, [])


    useEffect(() => {

        const fetchRegistrationData = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/events/getRegistrationDataOfEvent`, {
                    params: {
                        eventId: eventId,
                    },
                    headers: {
                        "auth-token": token
                    }
                });
                if (data.result) {

                    if (data?.data[0]?.sId) {
                        const map = {};
                        for (let subEvent of data.data) {
                            map[subEvent.sId] ? map[subEvent.sId].push(subEvent) : map[subEvent.sId] = [subEvent];
                        }

                        const events = Object.values(map);
                        setEventRegistrations(events);
                    } else {
                        setEventData((old) => ({ ...old, hasSubEvents: false }));
                        setEventRegistrations(data?.data);
                    }
                }
            } catch (error) {
                // Handle error
            }
        };

        fetchRegistrationData();
    }, [eventId, ])

    useEffect(() => {

        const fetchEventData = async () => {

            try {

                const { data } = await axios.get(`${API_URL}/api/events/getSpecificEvent/${eventId}`, {
                    headers: {
                        "auth-token": token
                    }
                })

                if (data?.result) {
                    setEventData(data?.data[0]);
                    if (data?.data[0]?.hasSubEvents) {
                        setSubEvents(transformSubEventData(data?.data[0].subEvents))
                    }
                }
                else {
                    setEventData({});
                }


            } catch (error) {
                console.log(error)
            }
        }


        fetchEventData();

    }, [eventId])



    useEffect(() => {
        if (!userData || userData?.role === "" || userData?.role === undefined) return;
        if (userData.role === "Student") {
            navigate("/home");
        }
        setShowOverLay(false);
    }, [userData, navigate]);

    return (
        <>
            {
                showOverLay
                &&
                <Overlay />
            }
            <section className='my-2 px-2 py-2'>
                {
                    !eventData?.hasSubEvents
                        ?

                        <p className=' text-base md:text-2xl text-center text-white bg-blue-500 p-2'>
                            Participants of {eventData.ename}
                        </p>
                        :
                        <section className='text-lg md:text-xl  text-white bg-blue-500 p-2 grid grid-cols-1 md:grid-cols-2 gap-5'>
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
            </section>
        </>
    )
}
