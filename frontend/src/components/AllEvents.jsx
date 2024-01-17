import React, { useEffect, useMemo, useState } from 'react'

import { useDispatch,useSelector } from 'react-redux';
import { fetchAllEvents } from '../store/EventSlice';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import { checkIsLoggedIn } from '../utils';
export default function AllEvents() {

    // const [data, setData] = useState([]);

    // const API_URL = process.env.REACT_APP_BASE_URL;

    const dispatch = useDispatch();
    const data = useSelector((state)=>state.EventSlice.data);
    const isLoading = useSelector((state)=>state.EventSlice.isLoading);
    const errorObj = useSelector((state)=>state.EventSlice.errorObj);
    const navigate = useNavigate();
    // const labels = useMemo(()=>{
    //   return data.length > 0 ? Object.keys(data[0]):[];
    // },[data]);
    
    useEffect(()=>{
        console.log(errorObj,data)
    },[errorObj])


    useEffect(() => {
        // fetchEvents();
        dispatch(fetchAllEvents());
    }, [])

    useEffect(()=>{
       const response = checkIsLoggedIn();
       console.log("il",response)
    //    if(!isLoggedIn) navigate("/login");
    },[])

    return (
        <section className='flex justify-center items-center'>


            <section className='md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:block mb-5 '>
                {
                    isLoading ?
                    
                        [1,2,3,4,5,6].map((event,idx)=>{
                            return <EventCard key={idx} isLoading={isLoading}/>
                        })
                        :
                        data && data?.map((event,idx)=>{
                            return <EventCard key={event._id} data={event} isLoading={isLoading}/>
                        })
                }
                
            </section>
        </section>
    )
}
