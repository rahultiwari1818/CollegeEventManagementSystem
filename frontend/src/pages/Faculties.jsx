import React, { useEffect, useState } from 'react'
import Overlay from '../components/Overlay'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { ReactComponent as BackIcon } from "../assets/Icons/BackIcon.svg";

export default function Faculties() {


	const API_URL = process.env.REACT_APP_BASE_URL;
	const token = localStorage.getItem("token");


	const [showOverLay, setShowOverLay] = useState(true)
	const [facultyData, setFacultyData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const userData = useSelector((state) => state.UserSlice);
	const navigate = useNavigate();

	const fetchFacultiesCourseWise = async () => {

		try {
			setIsLoading(true);
			const { data } = await axios.get(`${API_URL}/api/faculties/countFacultiesByCourse`, {
				headers: {
					"auth-token": token
				}
			})

			if (data?.result) {
				setFacultyData(data.data)
			}

		} catch (error) {
			console.log(error)
		}
		finally {
			setIsLoading(false);
		}

	}

	useEffect(() => {
		fetchFacultiesCourseWise();
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
			<BackIcon className="absolute left-8 md:left-12 top-18 cursor-pointer"
					onClick={() => {
						navigate("/adminDashboard");
					}}
				/>

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
									facultyData.reduce((cur, data) => cur + data.count, 0)
							}
						</p>
						<p>Total Faculties </p>

					</section>
				</section>
				<section className="my-5 md:flex justify-end items-center gap-5 mx-5">
					<Link to="/addfaculties" className='px-5 py-2 block my-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:outline hover:outline-yellow-500 hover:bg-white hover:text-yellow-500'>
						Add Faculties
					</Link>
					<Link to="/viewfaculties" className='px-5 py-2 block my-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:outline hover:outline-yellow-500 hover:bg-white hover:text-yellow-500'>
						View Faculties
					</Link>

				</section>
				<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-5 pt-5 h-[50vh] overflow-scroll">
					{
						isLoading ?
							Array.from({ length: 6 }, (_, idx) => ({ name: idx + 1 })).map((data, id) => {
								return (
									<section className='bg-white rounded-lg shadow-lg px-5 py-4 mx-3 my-3'>
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
							facultyData?.map((course) => {
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
													course?.count
											}

										</p>
										<p className="text-center text-blue-500 text-base md:text-xl">Total Faculties</p>
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
													course?.course === "All" ? "Super Admin" : course?.course
											}

										</p>

									</section>
								)
							})
					}
				</section>
			</section>
		</>
	)
}
