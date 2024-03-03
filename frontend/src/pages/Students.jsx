import React, { useEffect, useState } from 'react'
import Overlay from '../components/Overlay'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import MaleImage from "../assets/images/MaleIcon.png"
import FemaleImage from "../assets/images/FemaleIcon.png"
import OtherImage from "../assets/images/OtherIcon.png"
import { toast } from "react-toastify";
import { ReactComponent as BackIcon } from "../assets/Icons/BackIcon.svg";

export default function Students() {


	const token = localStorage.getItem("token");
	const API_URL = process.env.REACT_APP_BASE_URL;

	const [showOverLay, setShowOverLay] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [studentData, setStudentData] = useState([]);
	const userData = useSelector((state) => state.UserSlice);
	const navigate = useNavigate();

	const fetchStudentData = async () => {

		try {
			setIsLoading(true)
			const { data } = await axios.get(`${API_URL}/api/students/getStudentDataCourseWise`, {
				headers: {
					"auth-token": token
				}
			})

			if (data?.result) {
				setStudentData(data?.data);
			}
			else {
				setStudentData([]);
			}

		} catch (error) {
			console.log(error)
		}
		finally {
			setIsLoading(false)
		}



	}

	const promoteStudentsToNextSemester = async (courseName) => {
		setShowOverLay(true);
		try {

			const { data } = await axios.patch(`${API_URL}/api/students/promoteStudentsToNextSemester`, { courseName }, {
				headers: {
					"auth-token": token,
				}
			});

			if (data?.result) {
				toast.success(data.message);
				fetchStudentData();
			}

		} catch (error) {
			console.log(error)
		}
		finally {
			setShowOverLay(false);
		}

	}



	useEffect(() => {
		fetchStudentData();
	}, [])


	useEffect(() => {
		if (!userData || userData?.role === "" || userData?.role === undefined) return;
		if (userData.role !== "Super Admin") {
			navigate("/home");
		}
		setShowOverLay(false);
	}, [userData, navigate]);

	return (
		<>
			{
				showOverLay
				&&
				<Overlay />
			}
			<section className='w-full h-full py-3 '>
				<section className="absolute left-8 md:left-12 top-18 cursor-pointer p-2 md:p-3 rounded-full bg-blue-500">
					<BackIcon
						onClick={() => {
							navigate("/adminDashboard");
						}}
					/>
				</section>


				<section className="flex justify-center items-center">
					<section className=' text-blue-500 px-3 py-3 mb-3 text-base md:text-xl shadow-lg rounded-lg'>

						<p className="text-center">
							{
								isLoading ?
									<Skeleton
										count={1}
										height="50%"
										width="100%"
										baseColor="#ffffff"
										highlightColor="#4299e1"
										duration={0.9}
									/>
									:
									studentData.reduce((cur, data) => cur + data.totalStudents, 0)
							}
						</p>
						<p>Total Students </p>

					</section>
				</section>
				<section className="my-5 md:flex justify-end items-center gap-5 mx-5">
					<Link to="/addstudents" className='px-5 py-2 block my-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:outline hover:outline-yellow-500 hover:bg-white hover:text-yellow-500'>
						Add Students
					</Link>
					<Link to="/viewstudents" className='px-5 py-2 block my-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:outline hover:outline-yellow-500 hover:bg-white hover:text-yellow-500'>
						View Students
					</Link>

				</section>
				<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-5 h-[50vh] overflow-scroll pt-5">
					{
						isLoading ?
							Array.from({ length: 6 }, (_, idx) => ({ name: idx + 1 })).map((data, id) => {
								return (
									<section className='bg-white rounded-lg shadow-lg px-5 py-4 mx-3 my-3' key={id}>
										<p className="text-center text-blue-500 text-xl md:text-2xl lg:text-3xl">
											<Skeleton
												count={1}
												height="50%"
												width="100%"
												baseColor="#ffffff"
												highlightColor="#4299e1"
												duration={0.9}
											/>


										</p>
										<p className="text-center text-blue-500 text-xl md:text-2xl lg:text-3xl">

											<Skeleton
												count={1}
												height="50%"
												width="100%"
												baseColor="#ffffff"
												highlightColor="#4299e1"
												duration={0.9}
											/>

										</p>
									</section>
								)
							})
							:
							studentData?.map((course) => {
								return (
									<section className='bg-white rounded-lg shadow-lg px-5 py-4 mx-3 my-3 hover:transform hover:-translate-y-3 hover:translate-x-3 hover:transition-transform'>
										<p className="text-center text-blue-500 text-xl md:text-2xl lg:text-3xl">
											{
												isLoading ?
													<Skeleton
														count={1}
														height="50%"
														width="100%"
														baseColor="#ffffff"
														highlightColor="#4299e1"
														duration={0.9}
													/>
													:
													course?.totalStudents
											}

										</p>
										<p className="text-center text-blue-500 text-base md:text-xl">Total Students</p>
										<p className="text-center text-blue-500 text-xl md:text-2xl lg:text-3xl">
											{
												isLoading ?
													<Skeleton
														count={1}
														height="50%"
														width="100%"
														baseColor="#ffffff"
														highlightColor="#4299e1"
														duration={0.9}
													/>
													:
													course?.courseName
											}

										</p>
										<section className="mt-3 grid grid-cols-2 md:grid-cols-3">
											<section className='text-center'>
												<p className='text-base md:text-lg lg:text-xl text-center text-blue-500'>{course?.maleStudents}</p>
												<section className='my-2'>
													<img src={MaleImage} alt="" />
												</section>
											</section>
											<section className='text-center'>
												<p className='text-base md:text-lg lg:text-xl text-blue-500'>{course?.femaleStudents}</p>
												<section className='my-2' >
													<img src={FemaleImage} alt="" />
												</section>
											</section>
											<section className='text-center'>
												<p className='text-base md:text-lg lg:text-xl text-blue-500'>{course?.otherStudents}</p>
												<section className='my-2'>
													<img src={OtherImage} alt="" />
												</section>
											</section>
										</section>
										<section className="flex justify-center items-center mt-3">
											<button className='py-2 rounded-lg shadow-lg px-5 bg-blue-500 text-white '
												onClick={() => promoteStudentsToNextSemester(course.course)}
											>
												Promote Students to Next Semester
											</button>
										</section>
									</section>
								)
							})
					}
				</section>
			</section>
		</>
	)
}
