import React from 'react'
import { useNavigate } from 'react-router-dom';
import { formatMongoDate } from '../utils';
import "../styles/EventCard.css";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CardBG from "../assets/images/cardBG.jpeg"

export default function EventCard({ data, isLoading }) {
  const navigate = useNavigate();

  const getEventDetails = (id) => {
    navigate(`/eventdetails/${id}`);
  }

  return (
    <section className=' text-blue-500 text-bold  p-5 mt-3 rounded-lg shadow-lg bg-white h-[250px] w-[300px] md:w-[330px] outline outline-blue-400 sm:mt-5 relative'>
      <img src={isLoading ? CardBG :data?.enature.eventTypeLogoPath} alt="event type" className='absolute top-0 bottom-0 left-0 right-0 w-full h-[250px] opacity-30' />
     <section className='relative'>

        <section className="h-[125px]">
          <p className={`${!isLoading ? '' :'self-start'}text-base font-bold  text-nowrap w-full h-full`}>
            {isLoading ? (
              <Skeleton
                count={1}
                height="20%"
                width="100%"
                baseColor="#4299e1"
                highlightColor="#f7fafc"
                duration={0.9}
              />
            ) : (
              data?.ename
            )}
          </p>
        </section>

        <section className='h-[125px] '>
          <section className="flex justify-between w-full h-full items-center">
          <p className='text-base mb-1 ml-1 flex items-center'>
              {isLoading ? (
                <Skeleton
                  count={1}
                  height="20%"
                  width="50%"
                  baseColor="#4299e1"
                  highlightColor="#f7fafc"
                  duration={0.9}
                />
              ) : (
                formatMongoDate(data?.edate)
              )}
            </p>
            
              <button
                className={` ${isLoading?"cursor-not-allowed":""} text-nowrap px-5 py-3 bg-green-500 hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500 rounded text-white `}
                onClick={() => getEventDetails(data?._id)}
                disabled={isLoading}
              >
                Get Details
              </button>
          </section>
        </section>
     </section>

    </section>



  )
}
