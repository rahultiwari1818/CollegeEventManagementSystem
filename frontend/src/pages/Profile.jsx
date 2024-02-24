import React, { useEffect, useState } from 'react';
import DefaultImage from "../assets/images/DefaultUser.png";
import { ReactComponent as CameraIcon } from "../assets/Icons/CameraIcon.svg"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatMongoDate } from '../utils';
import Skeleton from 'react-loading-skeleton';
export default function Profile() {


    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const [profileData, setProfileData] = useState({});
    const user = useSelector((state) => state.UserSlice);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        const route = user.role === "Student" ? `students/getSpecificStudents/${user._id}` : `faculties/getSpecificFaculty/${user._id}`;
        const fetchUserData = async () => {
            try {

                setIsDataLoading(true)
                const { data } = await axios.get(`${API_URL}/api/${route}`, {
                    headers: {
                        "auth-token": token
                    }
                })
                setProfileData(data.data)
            } catch (error) {

            }
            finally {
                setIsDataLoading(false)
            }

        }
        if (user?.role !== "") {
            fetchUserData();
        }
    }, [user])

    return (
        <section className="h-full pt-3 my-2 pb-5  shadow-lg">
            <section className="flex items-center justify-center">
                <section className="max-w-lg w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                    <section className="bg-blue-500">
                        <section className="uppercase tracking-wide text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center py-5 sm:py-8 text-white font-semibold">
                            {
                                user.role
                            }
                            <span className='mx-2'>Profile </span>
                        </section>
                        <section className="w-full">
                            <section className="max-w-fit mx-auto rounded-full shadow-md p-1 bg-gray-50">
                                <img
                                    className="w-28 h-28 sm:w-40 sm:h-40 object-cover rounded-full shadow-md"
                                    src={DefaultImage}
                                    alt="Profile"
                                />
                                <section className="relative">
                                    <CameraIcon className="absolute ml-16 md:ml-24 -mt-5 cursor-pointer  bg-white px-3 py-2 rounded-full border border-black w-fit h-fit" />
                                </section>

                            </section>
                        </section>
                    </section>
                    <section className="">
                        {
                            user.role === "Student"
                                ?
                                <section className="p-8 md:justify-between border">
                                    <section className="">
                                        <section className="mt-4 grid grid-cols-2">
                                            <p className="text-gray-500">Name:</p>
                                            <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                                {
                                                    isDataLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="80%"
                                                            width="80%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        profileData?.name
                                                }
                                            </p>
                                        </section>
                                        <section className="mt-4 grid grid-cols-2">

                                            <p className="text-gray-500">SID:</p>
                                            <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                                {

                                                    isDataLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="80%"
                                                            width="80%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        profileData?.sid
                                                }
                                            </p>
                                        </section>
                                        <section className="mt-4 grid grid-cols-2">
                                            <p className="text-gray-500">Course:</p>
                                            <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                                {

                                                    isDataLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="80%"
                                                            width="80%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        profileData?.course
                                                }
                                            </p>
                                        </section>
                                        <section className="mt-4 grid grid-cols-2">
                                            <p className="text-gray-500">Roll No:</p>
                                            <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                                {

                                                    isDataLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="80%"
                                                            width="80%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        profileData?.rollno
                                                }
                                            </p>
                                        </section>
                                    </section>
                                    <section className="mt-4 grid grid-cols-2">
                                        <p className="text-gray-500">Semester:</p>
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                            {

                                                isDataLoading ?
                                                    <Skeleton
                                                        count={1}
                                                        height="80%"
                                                        width="80%"
                                                        baseColor="#4299e1"
                                                        highlightColor="#f7fafc"
                                                        duration={0.9}
                                                    />
                                                    :
                                                    profileData?.semester
                                            }
                                        </p>
                                    </section>
                                    <section className="mt-4 grid grid-cols-2">
                                        <p className="text-gray-500">Date of Birth:</p>
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                            {

                                                isDataLoading ?
                                                    <Skeleton
                                                        count={1}
                                                        height="80%"
                                                        width="80%"
                                                        baseColor="#4299e1"
                                                        highlightColor="#f7fafc"
                                                        duration={0.9}
                                                    />
                                                    :
                                                    formatMongoDate(profileData?.dob)
                                            }
                                        </p>
                                    </section>
                                    <section className="mt-4 grid grid-cols-2">
                                        <p className="text-gray-500">Phone No:</p>
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                            {


                                                isDataLoading ?
                                                    <Skeleton
                                                        count={1}
                                                        height="80%"
                                                        width="80%"
                                                        baseColor="#4299e1"
                                                        highlightColor="#f7fafc"
                                                        duration={0.9}
                                                    />
                                                    :
                                                    profileData?.phno
                                            }
                                        </p>
                                    </section>
                                    <section className="mt-4 grid grid-cols-2">
                                        <p className="text-gray-500">Email :</p>
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                            {

                                                isDataLoading ?
                                                    <Skeleton
                                                        count={1}
                                                        height="80%"
                                                        width="80%"
                                                        baseColor="#4299e1"
                                                        highlightColor="#f7fafc"
                                                        duration={0.9}
                                                    />
                                                    :
                                                    profileData?.email==="" ? <span className="text-red-500">Not Provided</span>
                                                    :
                                                    profileData.email
                                            }
                                        </p>
                                    </section>
                                    <section className="mt-4 grid grid-cols-2">
                                        <p className="text-gray-500">Gender:</p>
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                            {

                                                isDataLoading ?
                                                    <Skeleton
                                                        count={1}
                                                        height="80%"
                                                        width="80%"
                                                        baseColor="#4299e1"
                                                        highlightColor="#f7fafc"
                                                        duration={0.9}
                                                    />
                                                    :
                                                    profileData?.gender
                                            }
                                        </p>
                                    </section>
                                </section>
                                :
                                <section className="p-8 md:justify-between border">
                                    <section className="">
                                        <section className="mt-4 grid grid-cols-2">
                                            <p className="text-gray-500">Salutation:</p>
                                            <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                                {

                                                    isDataLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="80%"
                                                            width="80%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        profileData?.salutation
                                                }
                                            </p>
                                        </section>
                                        <section className="mt-4 grid grid-cols-2">

                                            <p className="text-gray-500">Name:</p>
                                            <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                                {

                                                    isDataLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="80%"
                                                            width="80%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        profileData?.name
                                                }
                                            </p>
                                        </section>
                                        <section className="mt-4 grid grid-cols-2">
                                            <p className="text-gray-500">Course:</p>
                                            <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                                {

                                                    isDataLoading ?
                                                        <Skeleton
                                                            count={1}
                                                            height="80%"
                                                            width="80%"
                                                            baseColor="#4299e1"
                                                            highlightColor="#f7fafc"
                                                            duration={0.9}
                                                        />
                                                        :
                                                        profileData?.course
                                                }
                                            </p>
                                        </section>
                                    </section>
                                    <section className="mt-4 grid grid-cols-2">
                                        <p className="text-gray-500">Phone No:</p>
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                            {

                                                isDataLoading ?
                                                    <Skeleton
                                                        count={1}
                                                        height="80%"
                                                        width="80%"
                                                        baseColor="#4299e1"
                                                        highlightColor="#f7fafc"
                                                        duration={0.9}
                                                    />
                                                    :
                                                    profileData?.phno
                                            }
                                        </p>
                                    </section>
                                    <section className="mt-4 grid grid-cols-2">
                                        <p className="text-gray-500">Email :</p>
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                            {

                                                isDataLoading ?
                                                    <Skeleton
                                                        count={1}
                                                        height="80%"
                                                        width="80%"
                                                        baseColor="#4299e1"
                                                        highlightColor="#f7fafc"
                                                        duration={0.9}
                                                    />
                                                    :
                                                    profileData?.email || <span className="text-red-500">Not Provided</span>
                                            }
                                        </p>
                                    </section>
                                </section>
                        }
                    </section>
                </section>
            </section>
        </section>
    )
}
