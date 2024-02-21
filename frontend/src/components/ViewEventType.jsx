import React, { useEffect } from 'react'
import { fetchAllEventTypes } from '../store/EventTypeSlice';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';

export default function ViewEventType() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.EventTypeSlice.data);
  const isDataLoading = useSelector((state) => state.EventTypeSlice.isLoading);


  useEffect(() => {
    // fetchEvents();
    dispatch(fetchAllEventTypes());
  }, [dispatch])

  return (
    <section>
      <section className='overflow-x-auto'>
        <table className='table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead className='bg-blue-500 text-white'>
            <tr>
              <th className='px-4 py-2'>Sr No</th>
              <th className='px-4 py-2'>Event Type</th>
              <th className='px-4 py-2'>Event Type Logo</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 border border-blue-500">
            {
              isDataLoading ?
                [1, 2, 3, 4, 5].map((skeleton, idx) => {
                  return <tr key={idx}>
                    <td className="border px-4 py-2 ">
                      <Skeleton
                        count={1}
                        height="50%"
                        width="100%"
                        baseColor="#4299e1"
                        highlightColor="#f7fafc"
                        duration={0.9}
                      />
                    </td>
                    <td className="border px-4 py-2 ">
                      <Skeleton
                        count={1}
                        height="50%"
                        width="100%"
                        baseColor="#4299e1"
                        highlightColor="#f7fafc"
                        duration={0.9}
                      />
                    </td>

                    <td className="border px-4 py-2 ">
                      <Skeleton
                        count={1}
                        height="50%"
                        width="100%"
                        baseColor="#4299e1"
                        highlightColor="#f7fafc"
                        duration={0.9}
                      />
                    </td>
                  </tr>
                  
                })
                :
                data?.map((eventType, idx) => {
                  return <tr key={eventType._id}>
                    <td className='border px-4 py-2'>{idx + 1}</td>
                    <td className='border px-4 py-2'>{eventType.eventTypeName}</td>
                    <td className='border px-4 py-2'>
                      <img src={eventType.eventTypeLogoPath} className='h-[5vh] w-[5vw]'/></td>
                  </tr>
                })

            }
          </tbody>
        </table>
      </section>
    </section>
  )
}
