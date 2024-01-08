import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function EventCard({data}) {
  const navigate = useNavigate();
  const getEventDetails = (id) =>{
    navigate(`/eventdetails/${id}`);
  }

  return (
    <section className='flex justify-between items-center gap-3 p-5 my-3 rounded-lg shadow-lg bg-white h-[250px] w-[350px] outline outline-blue-400 sm:mt-5  '>

      <p>{data?.ename}</p>
      <button
        className='px-5 py-3 bg-green-500 rounded'
        onClick={()=>getEventDetails(data?._id)}
      >
        Get Details
        </button>
    </section>
  )
}
