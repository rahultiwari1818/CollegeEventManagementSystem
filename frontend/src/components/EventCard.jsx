import React from 'react'
import { useNavigate } from 'react-router-dom';
import { formatMongoDate } from '../utils';
import "./EventCard.css";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

export default function EventCard({ data, isLoading }) {
  const navigate = useNavigate();

  const getEventDetails = (id) => {
    navigate(`/eventdetails/${id}`);
  }

  return (
    <section className='card-bg-image text-white  p-5 mt-3 rounded-lg shadow-lg bg-white h-[250px] w-[350px] outline outline-blue-400 sm:mt-5 flex justify-between'>
      <section className="flex-1 flex flex-col justify-between">
        <p className={`${!isLoading ? '' :'self-start'}text-base font-bold  text-nowrap`}>
          {isLoading ? (
            <Skeleton
              count={1}
              height="100%"
              width="100%"
              baseColor="#4299e1"
              highlightColor="#f7fafc"
              duration={0.9}
            />
          ) : (
            data?.ename
          )}
        </p>
        <p className='text-base mb-1 ml-1'>
          {isLoading ? (
            <Skeleton
              count={1}
              height="100%"
              width="50%"
              baseColor="#4299e1"
              highlightColor="#f7fafc"
              duration={0.9}
            />
          ) : (
            formatMongoDate(data?.edate)
          )}
        </p>
      </section>

      <section className='flex-1 flex flex-col justify-between'>
        <section>

        </section>
        <section>
          <button
            className=' text-nowrap px-5 py-3 bg-green-500 hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500 rounded text-white self-end'
            onClick={() => getEventDetails(data?._id)}
            disabled={isLoading}
          >
            Get Details
          </button>
        </section>
      </section>

    </section>



  )
}
