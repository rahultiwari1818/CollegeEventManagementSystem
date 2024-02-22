import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../store/CourseSlice';
import Skeleton from 'react-loading-skeleton';

export default function ViewCourses() {


    const dispatch = useDispatch();
    const data = useSelector((state)=>state.CourseSlice.data);
    const isDataLoading = useSelector((state)=>state.CourseSlice.isLoading);


    useEffect(() => {
        // fetchEvents();
        dispatch(fetchAllCourses());
    }, [dispatch])

  return (
    <section>
        <section className='overflow-x-auto'>
			<table className='table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
				<thead className='bg-blue-500 text-white'>
					<tr>
						<th className='px-4 py-2'>Sr No</th>
						<th className='px-4 py-2'>Course Name</th>
						<th className='px-4 py-2'>No of Semesters</th>
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
													data?.map((course,idx)=>{
														return <tr key={course._id}>
															<td className='border px-4 py-2'>{idx+1}</td>
															<td className='border px-4 py-2'>{course.courseName}</td>
															<td className='border px-4 py-2'>{course.noOfSemesters}</td>
														</tr>
													})

					}
				</tbody>
			</table>
        </section>
    </section>
  )
}
