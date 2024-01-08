import React, { useEffect, useMemo, useState } from 'react'

import { useDispatch,useSelector } from 'react-redux';
import { fetchAllEvents } from '../store/EventSlice';
import EventCard from './EventCard';
export default function AllEvents() {

    // const [data, setData] = useState([]);

    // const API_URL = process.env.REACT_APP_BASE_URL;

    const dispatch = useDispatch();
    const data = useSelector((state)=>state.EventSlice.data);


    // const labels = useMemo(()=>{
    //   return data.length > 0 ? Object.keys(data[0]):[];
    // },[data]);
    
 


    useEffect(() => {
        // fetchEvents();
        dispatch(fetchAllEvents());
    }, [])

    return (
        <section className='flex justify-center items-center'>

            <section className='md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:block '>
                {
                data && data?.map((event,idx)=>{
                        return <EventCard key={event._id} data={event}/>
                    })
                }
            </section>
        </section>
    )
}
