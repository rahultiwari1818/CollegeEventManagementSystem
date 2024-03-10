import React, { useCallback, useEffect, useRef, useState } from 'react';
import DefaultImage from "../assets/images/DefaultUser.png";
import { ReactComponent as CameraIcon } from "../assets/Icons/CameraIcon.svg"
import DefaultBanner from "../assets/images/DefaultPDFBanner.jpeg"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatMongoDate } from '../utils';
import Skeleton from 'react-loading-skeleton';
import ChangeProfilPic from '../components/ChangeProfilePic';
import ChangePassword from '../components/ChangePassword';
import UpdateFaculty from "../components/UpdateFaculty";
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import Overlay from '../components/Overlay';

export default function Profile() {


    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const [profileData, setProfileData] = useState({});
    const user = useSelector((state) => state.UserSlice);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isOpenChangeProfilePicModal, setIsOpenChangeProfilePicModal] = useState(false);
    const [isOpenChangePasswordModal,setIsOpenChangePasswordModal] = useState(false);
    const [openUpdateModal,setOpenUpdateModal] = useState(false);
    const [isOpenCollegeUpdateModal,setIsOpenCollegeUpdateModal] = useState(false);

    const [collegeData,setCollegeData] = useState();


    const openProfilePicModal = () => {
        setIsOpenChangeProfilePicModal(true)
    }
    const closeProfilePicModal = () =>{
        setIsOpenChangeProfilePicModal(false)
    }

    const openChangePasswordModal = () =>{
        setIsOpenChangePasswordModal(true);
    }

    const closeChangePasswordModal = () =>{
        setIsOpenChangePasswordModal(false);
    }

    const openUpdateProfilModal = () =>{
        setOpenUpdateModal(true);
    }

    const closeUpdateProfilModal = () =>{
        setOpenUpdateModal(false);
    }

    const openCollegeUpdateModal = () =>{
        setIsOpenCollegeUpdateModal(true);
    }

    const closeCollegeUpdateModal = () =>{
        setIsOpenCollegeUpdateModal(false);
    }

    const changeProfilePicURL = useCallback((data)=>{
        setProfileData((old)=>({
            ...old,
            profilePicPath:data.profilePicPath,
            profilePicName:data.profilePicName
        }))
    },[])

    const updateProfileData = useCallback((data)=>{
        setProfileData(data)
    },[])

    const updateCollegeData = useCallback((data)=>{
        setCollegeData(data)
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

        const fetchCollegeData = async()=>{

            try {
                
                const {data} = await axios.get(`${API_URL}/api/faculties/getCollegeDetails`,{
                    headers:{
                        "auth-token":token,
                    }
                })

                setCollegeData(data.data[0])


            } catch (error) {
                console.log(error)
            }

            
        }


        if (user?.role !== "") {
            fetchUserData();
            fetchCollegeData();
        }
    }, [user])


    return (
        <section className="h-full pt-3 my-2 pb-5  ">
            <section className="flex items-center justify-center">
                <section className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
                    <section className="bg-gradient-to-r from-cyan-500 to-blue-500 ">
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
                                    src={
                                        isDataLoading ?
                                        DefaultImage
                                        :
                                        profileData?.profilePicPath==="."?DefaultImage:profileData?.profilePicPath}
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
                    <section className='px-8 pt-8'>
                    <section className="mt-4 grid grid-cols-2">
                                            <p className="text-gray-500">College Name:</p>
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
                                                        collegeData?.collegename
                                                }
                                            </p>
                                        </section>
                    </section>
                    <section className="">
                        {
                            user.role === "Student"
                                ?
                                <section className="px-8 pb-8 md:justify-between ">
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
                                                        profileData?.courseName
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
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black break-words">
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
                                <section className="px-8 pb-8 md:justify-between ">
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
                                        <p className="mt-1 text-md sm:text-lg leading-tight font-medium text-black break-words">
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
                    <section className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 pb-5">
                   {
                    user.role === "Super Admin"
                    &&
                    <>
                    <button className='px-5 py-3 my-2 block w-full bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                   onClick={ openUpdateProfilModal}
                    >
                            Update Profile Data
                        </button>
                        <button className='px-5 py-3 my-2 block w-full bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                   onClick={ openCollegeUpdateModal}
                    >
                            Update College Data
                        </button>
                        </>

                   }
                        <button className='px-5 mx-2 py-3 my-2 block w-full bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                        onClick={openChangePasswordModal}
                        >
                            Change Password
                        </button>
                    </section>
                </section>
            </section>
            <UpdateFaculty isOpen={openUpdateModal} close={closeUpdateProfilModal} heading={"Update Faculty Data"} dataToBeUpdated={profileData} updateStateData={updateProfileData} />
            <ChangeProfilPic isOpen={isOpenChangeProfilePicModal} close={closeProfilePicModal} heading={"Change Profile Pic"} imgUrl={profileData?.profilePicPath} changeProfilePicURL={changeProfilePicURL} />
            <ChangePassword isOpen={isOpenChangePasswordModal} close={closeChangePasswordModal} heading={"Change Password"}/>
            <ChangeCollegeNameModal  isOpen={isOpenCollegeUpdateModal} close={closeCollegeUpdateModal} heading={"Update College Name"} dataToBeUpdated={collegeData} updateStateData={updateCollegeData}/>
        </section>
    )
}


const ChangeCollegeNameModal = ({isOpen,close,heading,dataToBeUpdated,updateStateData}) =>{

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const [formData,setFormData] = useState({newCollegePdfBanner:""});

    const [showOverlay,setShowOverlay] = useState(false);

    const [errors,setErrors] = useState({
        collegenameErr:""
    })

    const fileInputRef = useRef(null);




    const handleUpdateCollegeData = async ( ) =>{

        if(formData.collegename.trim().length===0){
            setErrors((old)=>({...old,collegenameErr:"Enter a Valid College Name.!"}))
            return;
        }

        try {
            setShowOverlay(true);

            const dataToPost = new FormData();

            dataToPost.append("newCollegeName",formData.collegename.trim())
            dataToPost.append("id",formData._id)
            dataToPost.append("oldCollegePDFBannerName",formData?.collegePdfBannerName)
            dataToPost.append("oldCollegePDFBannerPath",formData?.collegePdfBannerPath)
            dataToPost.append("newCollegePdfBanner",formData?.newCollegePdfBanner)
            
            const {data} = await axios.patch(`${API_URL}/api/faculties/updateCollegeData`,dataToPost,{
                headers:{
                    "auth-token":token,
                    "Content-Type":"multipart/form-data"
                }
            })

            if(data.result){
                toast.success(data.message);
                updateStateData(data.data);
                close();
            }


        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
        finally{
            setShowOverlay(false);
        }
    }

    useEffect(()=>{
        if(dataToBeUpdated?.collegename){
            setFormData({...formData,...dataToBeUpdated});
        }

        if(!isOpen){
            setFormData({newCollegePdfBanner:""})
        }
    },[isOpen,close,heading,updateStateData,dataToBeUpdated])

    



    return (
<>
        {
            showOverlay &&
            <Overlay/>
        }
        <Modal isOpen={isOpen} close={close} heading={heading}>
            <section className='my-2 py-3 px-3'>
            <section className='md:p-2 md:m-2 p-1 m-1'>
                            <label htmlFor="ename">College Name:</label>
                            <input
                                type="text"
                                name="collegename"
                                value={formData?.collegename}
                                onChange={(e)=>{
                                    setFormData((old)=>({...old,collegename:e.target.value}))
                                }}
                                placeholder='Enter College Name'
                                className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                                required
                            />
                            {
                                errors.collegenameErr !== ""
                                &&
                                <p className="text-red-500 my-2">
                                    {
                                        errors.collegenameErr
                                    }
                                </p>
                            }
                        </section>
            <section className='md:p-2 md:m-2 p-1 m-1'>
                            <label htmlFor="img">Existing College PDF Banner : </label>
                            <section className="w-full">
                                <img src={formData.collegePdfBannerPath==="." ? DefaultBanner :formData.collegePdfBannerPath } alt="banner" srcSet=""  className='block border border-blue-500 w-full h-[20vh]'/>
                            </section>
                            <section className="my-2 flex flex-col items-center">
                        {formData.newCollegePdfBanner && (
                            <p className="mb-2">
                             New  Filename: {formData.newCollegePdfBanner.name}, Size: {formData.newCollegePdfBanner.size} bytes
                            </p>
                        )}
                        <input
                            type="file"
                            name="newCollegePdfBanner"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e)=>{
                                const file = e.target.files[0];
                                setFormData((old)=>({...old,newCollegePdfBanner:file}))
                            }}
                        />
                        {
                                <button
                                    className="px-5 py-2 shadow-lg rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500  text-white hover:bg-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    onClick={()=>{
                                        fileInputRef.current.click();
                                    }}
                                >
                                    Change College Banner
                                </button>
                        }
                    </section>

            </section>
                        <section className='md:p-2 md:m-2 p-1 m-1'>
                                <button className="px-5 py-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:outline hover:outline-yellow-500 hover:bg-white hover:text-yellow-500"
                                onClick={handleUpdateCollegeData}
                                >
                                    Update College Data
                                </button>
                        </section>
            </section>
        </Modal>
        </>
    )
}

