import React, { useCallback, useEffect, useRef, useState } from 'react';
import DefaultImage from "../assets/images/DefaultUser.png";
import { ReactComponent as CameraIcon } from "../assets/Icons/CameraIcon.svg"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatMongoDate } from '../utils';
import Skeleton from 'react-loading-skeleton';
import Modal from '../components/Modal';
import {toast} from "react-toastify";

export default function Profile() {


    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const [profileData, setProfileData] = useState({});
    const user = useSelector((state) => state.UserSlice);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isOpenChangeProfilePicModal, setIsOpenChangeProfilePicModal] = useState(false);
    const openProfilePicModal = () => {
        setIsOpenChangeProfilePicModal(true)
    }
    const closeProfilePicModal = () =>{
        setIsOpenChangeProfilePicModal(false)
    }

    const changeProfilePicURL = useCallback((data)=>{
        setProfileData((old)=>({
            ...old,
            profilePicPath:data.profilePicPath,
            profilePicName:data.profilePicName
        }))
        console.log(profileData)
    },[])

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
        <section className="h-full pt-3 my-2 pb-5  ">
            <section className="flex items-center justify-center">
                <section className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
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
                                    src={profileData?.profilePicPath==="."?DefaultImage:profileData?.profilePicPath}
                                    alt="Profile"
                                />
                                <section className="relative">
                                    <section className='px-3 py-2 absolute ml-16 md:ml-24 -mt-5 cursor-pointer  bg-white  rounded-full border border-black w-fit h-fit'
                                        onClick={openProfilePicModal}
                                    >

                                        <CameraIcon />
                                    </section>
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
                                                    profileData?.email === "" ? <span className="text-red-500">Not Provided</span>
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
            <ChangeProfilPic isOpen={isOpenChangeProfilePicModal} close={closeProfilePicModal} heading={"Change Profile Pic"} imgUrl={profileData?.profilePicPath} changeProfilePicURL={changeProfilePicURL} />
        </section>
    )
}



const ChangeProfilPic = ({ isOpen, close, heading, imgUrl,changeProfilePicURL }) => {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const imageSrc = imgUrl === "." ? DefaultImage : imgUrl;

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Handle the selected file here (e.g., upload to server)
        setSelectedFile(file);
    };

    const uploadNewProfilePic = async() =>{

        try {
            
            const formData = new FormData();
            formData.append("profilePic",selectedFile);
            const {data} = await axios.post(`${API_URL}/api/students/changeProfilePic`,formData,{
                headers:{
                    "auth-token":token,
                    "Content-Type":"multipart/form-data"
                }
            })

            if(data.result){
                toast.success(data.message);
                changeProfilePicURL({profilePicPath:data.data.profilePicPath,profilePicName:data.data.profilePicName})
                close();
            }

        } catch ({response}) {
            toast.error(response?.data.message)
        }

    }

    useEffect(()=>{
        if(!isOpen){
            setSelectedFile(null);
        }
    },[isOpen])

    return (
        <Modal isOpen={isOpen} close={close} heading={heading}>
            <section>
                <section className="flex justify-center items-center">
                    <img
                        className="w-28 h-28 sm:w-40 sm:h-40 object-cover rounded-full shadow-md"
                        src={imageSrc}
                        alt="Profile"
                    />
                </section>


                <section className="my-2 flex flex-col items-center">
                    {selectedFile && (
                        <p className="mb-2">
                            Filename: {selectedFile.name}, Size: {selectedFile.size} bytes
                        </p>
                    )}
                    <input
                        type="file"
                        name="profilePic"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {
                        !selectedFile ?
                        <button
                            className="px-5 py-2 shadow-lg rounded-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            onClick={handleButtonClick}
                        >
                            Change Profile Photo
                        </button>
                        :
                        <button
                            className="px-5 py-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:bg-white hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            onClick={uploadNewProfilePic}
                        >
                            Upload 
                        </button>
                    }
                </section>
            </section>
        </Modal>
    )
}