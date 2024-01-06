import React, { useEffect, useMemo, useState } from 'react'
import {useNavigate} from "react-router-dom";
import { formatMongoDate } from '../utils';
import { useDispatch,useSelector } from 'react-redux';
import { fetchAllEvents } from '../store/EventSlice';
export default function AllEvents() {

    // const [data, setData] = useState([]);

    const API_URL = process.env.REACT_APP_BASE_URL;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state)=>state.EventSlice.data);


    const labels = useMemo(()=>{
      return data.length > 0 ? Object.keys(data[0]):[];
    },[data]);
    
    const getEventDetails = (id) =>{
        navigate(`/eventdetails/${id}`);
    }



    useEffect(() => {
        // fetchEvents();
        dispatch(fetchAllEvents());
    }, [])

    return (
        <section className='md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:block '>
            {
                [1,2,3].map((val,idx)=>{
                })
            }
        </section>
    )
}
