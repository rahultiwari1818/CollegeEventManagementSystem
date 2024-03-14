import React, { useCallback, useEffect, useState } from 'react'
import Dropdown from '../components/Dropdown'
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEventTypes } from '../store/EventTypeSlice';
import { transformEventTypesData } from '../utils';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
import axios from 'axios';
import AnalyticsCard from '../components/AnalyticsCard';
import { fetchCollegeDetails } from '../store/CollegeSlice';


export default function Analytics() {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;



    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.UserSlice);
    const eventTypesArr = useSelector((state) => state.EventTypeSlice.data);

    const [eventTypes, setEventTypes] = useState([]);
    const [filterParams, setFilterParams] = useState({
        eventType: "",
        fromDate: new Date(),
        toDate: new Date(new Date().setDate(new Date().getDate() - 7))

    })
    const [eventAnalytics, setEventAnalytics] = useState([]);



    const fetchEventAnalytics = async () => {
        try {

            const { eventType, fromDate, toDate } = filterParams;

            const enature = eventType == 0 ? "" : eventType;

            const { data } = await axios.get(`${API_URL}/api/faculties/getAnalytics`, {
                params: {
                    eventType:enature,
                    fromDate,
                    toDate
                },
                headers: {
                    "auth-token": token
                }
            });

            if (data.result) {
                setEventAnalytics(data.data)
            }

        } catch (error) {
            setEventAnalytics([]);
            console.log(error)
        }
    }





    const changeFilterParamsEventType = useCallback((value) => {
        setFilterParams((old) => ({ ...old, eventType: value }));
    }, [])

    useEffect(() => {
        fetchEventAnalytics();
    }, [filterParams.eventType, filterParams.fromDate, filterParams.toDate])

    useEffect(() => {
        dispatch(fetchAllEventTypes());
        dispatch(fetchCollegeDetails());
    }, [dispatch]);


    useEffect(() => {
        setEventTypes(transformEventTypesData(eventTypesArr,true));
    }, [eventTypesArr])


    useEffect(() => {
        if (!userData || userData?.role === "" || userData?.role === undefined) return;
        if (userData.role !== "Super Admin") {
            navigate("/home");
        }
        // setShowOverLay(false);
    }, [userData, navigate]);


    return (
        <section className=' py-2 h-full w-full'>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-5 py-3">
                <Dropdown
                    dataArr={eventTypes}
                    selected={filterParams.eventType}
                    setSelected={changeFilterParamsEventType}
                    label={"Select Event Type"}
                    name={"eventType"}
                    passedId={true}
                />
                <section className='flex justify-between px-2 md:justify-center items-center md:gap-3 shadow-lg rounded-lg'>
                    <label htmlFor="rcdate">From Date:</label><br />
                    <DatePicker
                        name='fromDate'
                        selected={filterParams.fromDate}
                        onChange={(date) => {
                            setFilterParams((old) => ({ ...old, fromDate: date }))
                        }
                        }
                        dateFormat="dd-MM-yyyy"
                        maxDate={new Date()}
                        className="w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                        showIcon
                        icon={
                            <section className="m-2">
                                <CalanderIcon />
                            </section>}
                    />
                </section>
                <section className='flex justify-between px-2 md:justify-center items-center md:gap-3 shadow-lg rounded-lg'>
                    <label htmlFor="rcdate">To Date:</label><br />
                    <DatePicker
                        name='toDate'
                        selected={filterParams.toDate}
                        onChange={(date) => {
                            setFilterParams((old) => ({ ...old, toDate: date }))
                        }
                        }
                        dateFormat="dd-MM-yyyy"
                        maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                        className="w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                        showIcon
                        icon={
                            <section className="m-2">
                                <CalanderIcon />
                            </section>}
                    />
                </section>
            </section>
            <section className="my-2">
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-5 py-3">
                    <section></section>
                    <section></section>
                    <section></section>
                </section>
            </section>
            <section className="my-2 pb-5">
                <p className="py-2 px-4 text-xl font-extrabold text-blue-500 border border-blue-500 rounded-lg">
                    Total Results :
                    <span className="px-2">
                        {
                            eventAnalytics.length
                        }
                    </span>
                </p>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-5 py-3">
                    {
                      eventAnalytics?.map((event)=>{
                        return <AnalyticsCard key={event.eventData._id} data={event}/>
                      })  
                    }
                </section>
            </section>

        </section>
    )
}

