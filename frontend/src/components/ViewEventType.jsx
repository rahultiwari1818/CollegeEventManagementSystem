import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { fetchAllEventTypes } from '../store/EventTypeSlice';

const ViewEventType = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.EventTypeSlice.data);
  const isDataLoading = useSelector((state) => state.EventTypeSlice.isLoading);

  useEffect(() => {
    dispatch(fetchAllEventTypes());
  }, [dispatch]);

  const groupByCourse = committeeMembers => {
    const groupedByCourse = committeeMembers.reduce((result, member) => {
      const courseId = member.course._id;
      if (!result[courseId]) {
        result[courseId] = {
          courseName: member.course.courseName,
          faculties: [],
        };
      }
      result[courseId].faculties.push(member);
      return result;
    }, {});
    return Object.values(groupedByCourse);
  };

  return (
    <section className='my-2'>
      <section className='overflow-x-auto'>
        <table className='table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead className='bg-blue-500 text-white'>
            <tr>
              <th className='px-4 py-2'>Sr No</th>
              <th className='px-4 py-2'>Event Type</th>
              <th className='px-4 py-2'>Event Type Logo</th>
              <th className='px-4 py-2'>Committee Members</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 border border-blue-500">
            {isDataLoading ? (
              [1, 2, 3, 4, 5].map((skeleton, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2 ">
                    <Skeleton count={1} height="50%" width="100%" baseColor="#4299e1" highlightColor="#f7fafc" duration={0.9} />
                  </td>
                  <td className="border px-4 py-2 ">
                    <Skeleton count={1} height="50%" width="100%" baseColor="#4299e1" highlightColor="#f7fafc" duration={0.9} />
                  </td>
                  <td className="border px-4 py-2 ">
                    <Skeleton count={1} height="50%" width="100%" baseColor="#4299e1" highlightColor="#f7fafc" duration={0.9} />
                  </td>
                </tr>
              ))
            ) : data?.length > 0 ? (
              data?.map((eventType, idx) => (
                <tr key={eventType._id}>
                  <td className='border px-4 py-2'>{idx + 1}</td>
                  <td className='border px-4 py-2'>{eventType.eventTypeName}</td>
                  <td className='border px-4 py-2'>
                    <img src={eventType.eventTypeLogoPath} className='h-[5vh] w-[5vw]' alt="Event Type Logo" />
                  </td>
                  <td className='border px-4 py-2'>
                    {groupByCourse(eventType.committeeMembers).map((courseGroup, index) => (
                      <section key={index} className="mb-4 border border-blue-500">
                        <h3 className="text-lg px-2 py-2 font-semibold mb-2 border-b border-blue-500">{courseGroup.courseName}</h3>
                        <ul>
                          {courseGroup.faculties.map(member => (
                            <li key={member._id} className="mb-2">
                              <section className="flex items-center border-b border-blue-500">
                                <section>
                                  <p className='text-center px-2'>{member.name}</p>
                                </section>
                              </section>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className='border px-4 py-2 text-center' colSpan={4}>Add Event Types To View.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default ViewEventType;
