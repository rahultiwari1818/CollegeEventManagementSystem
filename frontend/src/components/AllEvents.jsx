import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../store/EventSlice';
import EventCard from './EventCard';
export default function AllEvents() {

    // const [data, setData] = useState([]);

    // const API_URL = process.env.REACT_APP_BASE_URL;

    // const [hasMore,setHasMore] = useState(false);

    const dispatch = useDispatch();
    const data = useSelector((state) => state.EventSlice.data);
    const isLoading = useSelector((state) => state.EventSlice.isLoading);
    const totalEvents = useSelector((state)=>state.EventSlice.totalEvents);
    // const labels = useMemo(()=>{
    //   return data.length > 0 ? Object.keys(data[0]):[];
    // },[data]);

    const userCourse = useSelector((state) => state.UserSlice.course);


    useEffect(() => {
        // fetchEvents();
        dispatch(fetchAllEvents(userCourse));
    }, [dispatch, userCourse])


    return (
        <section className='flex justify-center items-center pb-5'>

            

            <section className='md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:block mb-5 '>
                {
                    isLoading ?

                        [1, 2, 3, 4, 5, 6, 7, 8].map((event, idx) => {
                            return <EventCard key={idx} isLoading={isLoading} />
                        })
                        :
                        data.length === 0
                        ?
                        <p className="text-center text-4xl font-black text-blue-500 py-3 mt-10 w-full">
                            No Events Found
                        </p>
                        :
                        data && data?.map((event, idx) => {
                            return <EventCard key={event._id} data={event} isLoading={isLoading} />
                        })
                }

            </section>
        </section>
    )
}
