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
import AllEventResultList from '../PDF_Generator/AllEventResultList';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Overlay from '../components/Overlay';


export default function Analytics() {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;



    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.UserSlice);
    const eventTypesArr = useSelector((state) => state.EventTypeSlice.data);
    const collegeData = useSelector((state) => state.CollegeSlice.data);

    const [eventTypes, setEventTypes] = useState([]);
    const [filterParams, setFilterParams] = useState({
        eventType: "",
        fromDate: new Date(),
        toDate: new Date(new Date().setDate(new Date().getDate() - 7))

    })
    const [eventAnalytics, setEventAnalytics] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [showOverlay,setShowOverLay] = useState(true);


    const fetchEventAnalytics = async () => {
        try {
            setIsLoading(true);
            const { eventType, fromDate, toDate } = filterParams;

            const enature = eventType == 0 ? "" : eventType;

            const { data } = await axios.get(`${API_URL}/api/faculties/getAnalytics`, {
                params: {
                    eventType: enature,
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
        finally{
            setIsLoading(false);
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
        setEventTypes(transformEventTypesData(eventTypesArr, true));
    }, [eventTypesArr])


    useEffect(() => {
        if (!userData || userData?.role === "" || userData?.role === undefined) return;
        if (userData.role !== "Super Admin") {
            navigate("/home");
        }
        setShowOverLay(false);
    }, [userData, navigate]);


    return (
        <>
        {
            showOverlay
            &&
            <Overlay/>
        }
            <section className=' py-2 h-full w-full'>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 px-5 py-3">
                    <Dropdown
                        dataArr={eventTypes}
                        selected={filterParams.eventType}
                        setSelected={changeFilterParamsEventType}
                        label={"Select Event Type"}
                        name={"eventType"}
                        passedId={true}
                    />
                    <section className='flex justify-between px-2 md:justify-center items-center md:gap-2 shadow-lg rounded-lg'>
                        <label htmlFor="rcdate" className='text-nowrap'>From Date:</label><br />
                        <DatePicker
                            name='fromDate'
                            selected={filterParams.fromDate}
                            onChange={(date) => {
                                
                                    // Otherwise, update only the "from" date
                                    setFilterParams((old) => ({ ...old, fromDate: date,toDate:date }));
                                
                            }}
                            dateFormat="dd-MM-yyyy"
                            maxDate={new Date()}
                            className="w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                            showIcon
                            icon={<section className="m-2"><CalanderIcon /></section>}
                        />
                    </section>
                    <section className='flex justify-between px-2 md:justify-center items-center md:gap-3 shadow-lg rounded-lg'>
                        <label htmlFor="rcdate">To Date:</label><br />
                        <DatePicker
                            name='toDate'
                            selected={filterParams.toDate}
                            onChange={(date) => {
                                if (date > filterParams.fromDate) {
                                    // If the selected "to" date is less than the current "from" date,
                                    // set the "from" date to the selected "to" date
                                    
                                } else {
                                    // Otherwise, update only the "to" date
                                    setFilterParams((old) => ({ ...old, toDate: date }));
                                }                        }
                            }
                            dateFormat="dd-MM-yyyy"
                            maxDate={new Date(new Date().setDate(new Date(filterParams.fromDate).getDate() - 1))}
                            className="w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                            showIcon
                            icon={
                                <section className="m-2">
                                    <CalanderIcon />
                                </section>}
                        />
                    </section>
                    <PDFDownloadLink document={<AllEventResultList eventAnalytics={eventAnalytics} collegeData={collegeData} fromDate={filterParams.fromDate} toDate={filterParams.toDate}  eventType={ eventTypes.find((eventType)=>eventType._id===filterParams.eventType)?.name || "" } />} fileName={`AllEventResults.pdf`} className='w-full '>
                        <button
                            className={` ${eventAnalytics.length === 0 ? "cursor-not-allowed" : ""}  text-nowrap px-5 py-3 bg-yellow-500 hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500 rounded-lg text-white `}
                            // onClick={openViewAnalyticsModal}
                            disabled={eventAnalytics.length === 0}
                        >
                            Download Results
                        </button>
                    </PDFDownloadLink>
                </section>
                <section className="my-2 pb-5">
                    <p className="py-2 px-4 text-xl font-extrabold text-blue-500 border border-blue-500 rounded-lg mx-2">
                        Total Results :
                        <span className="px-2">
                            {
                                eventAnalytics.length
                            }
                        </span>
                    </p>
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-5 py-3">
                        {
                            isLoading
                            ?
                            [1,2,3,4,5,6]?.map((event) => {
                                return <AnalyticsCard key={event} data={[]} />
                            })
                            :
                            eventAnalytics?.map((event) => {
                                return <AnalyticsCard key={event.eventData._id} data={event} />
                            })
                        }
                    </section>
                </section>

            </section>
        </>
    )
}

