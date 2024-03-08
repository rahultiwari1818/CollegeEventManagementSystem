import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import Overlay from '../components/Overlay';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import StudentImage from "../assets/images/StudentIcon.png"
import FacultyImage from "../assets/images/FacultyIcon.png"
import CourseImage from "../assets/images/CourseIcon.png"
import EventImage from "../assets/images/EventIcon.png"

export default function AdminDashboard() {

	const token = localStorage.getItem("token");
	const API_URL = process.env.REACT_APP_BASE_URL;

	const [collegeData, setCollegeData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [showOverLay, setShowOverLay] = useState(true)
	const userData = useSelector((state) => state.UserSlice);
	const navigate = useNavigate();


	useEffect(() => {
		if (!userData || userData?.role === "" || userData?.role === undefined) return;
		if (userData.role !== "Super Admin") {
			navigate("/home");
		}
		setShowOverLay(false);
	}, [userData, navigate]);

	const fetchCollegeData = async () => {

		try {
			setIsLoading(true)
			const { data } = await axios.get(`${API_URL}/api/faculties/getCollegeData`, {
				headers: {
					"auth-token": token
				}
			});
			setCollegeData(data.data)

		} catch (error) {
			console.log(error)
		}
		finally {
			setIsLoading(false)
		}


	}

	useEffect(() => {

		fetchCollegeData();

	}, [])

	const imagesArr = [CourseImage, StudentImage, FacultyImage, EventImage, EventImage];
	const routesArr = ["/courses", "/students", "/faculties", "/viewEventType", "/home"];

	return (
		<>
			{
				showOverLay
				&&
				<Overlay showWhiteBg={true} />
			}
			<section className='w-full h-full py-3 '>
				<section className="flex justify-center items-center">
					<section className='bg-gradient-to-r from-cyan-500 to-blue-500  text-white px-3 py-3 text-base md:text-lg shadow-lg rounded-lg md:w-[80vw] lg:w-[50vw]'>

						<p className='text-center'>College Event Management System of </p>
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
									collegeData[0][0]?.collegename
							}
						</p>
					</section>
				</section>
				<section className="bg-gradient-to-r from-cyan-500 to-blue-500  w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4 rounded-lg pb-5">

					{
						Array.from({ length: 5 }, (_, idx) => ({ name: idx + 1 })).map((data, id) => {
							return (
								<Link key={id} to={routesArr[id]} className='cursor-pointer hover:transform hover:-translate-y-3 hover:translate-x-3 hover:transition-transform my-2'>
								<section  className='bg-white rounded-lg shadow-lg px-5 py-4 mx-3 my-3'>
									<p className="text-center text-blue-500 text-3xl">
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
												collegeData[id + 1]?.data
										}

									</p>
									<p className="text-center text-blue-500 text-3xl">
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
										collegeData[id + 1]?.label
										}
									</p>
									<img src={imagesArr[id]} alt="" />
								</section>
								</Link>
							)
						})
					}

				</section>
			</section>
		</>
	)
}
