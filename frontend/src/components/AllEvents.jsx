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
        <section className='m-5'>

          {
            labels.length > 1  && 
          

            <table className="min-w-full border border-blue-500 divide-y divide-blue-500">
                <thead>
                    <tr className="bg-blue-500 text-white">
                    {labels.map((key) => (key !== '_id' && key !== "__v") && (
              <th key={key} className="py-2 px-4 sm:px-6 md:px-8">
                {key}
              </th>
            ))}
            <th className="py-2 px-4 sm:px-6 md:px-8"> Details</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-500 text-white'}>
              {labels.map((key) => (key !== '_id' && key !== "__v") && (
                <td key={key} className="py-2 px-4 sm:px-6 md:px-8">
                  {key === 'edate' || key === 'rcdate'  ? formatMongoDate((row[key])) : row[key]}
                </td>
              ))}
              <td className={index % 2 === 0 ? 'bg-white' : 'bg-blue-500 text-white'}>
                <button 
                className='px-3 py-2 rounded-lg shadow-lg bg-red-500 text-white hover:text-red-500 hover:bg-white'
                onClick={()=>{getEventDetails(row._id)}}
                >
                    Get Event Details
                    </button>
              </td>
            </tr>
          ))}
                    
                </tbody>
            </table>

              }
        </section>
    )
}
