import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Search from '../components/Search';
import Dropdown from '../components/Dropdown'; // Import the Dropdown component
import { debounce, transformCourseData } from '../utils';
import Skeleton from 'react-loading-skeleton';
import Overlay from '../components/Overlay';
import {  useSelector } from 'react-redux';
import ToggleSwitch from '../components/ToggleSwitch';
import UpdateFaculty from "../components/UpdateFaculty";
import { useNavigate } from 'react-router-dom';
import LockingConfirmation from '../components/LockingConfirmation';

export default function ViewFaculties() {
    const [facultyData, setFacultyData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        search: "",
        searchCourse: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(15); // State for selected entries per page
    const [totalEntries, setTotalEntries] = useState(0); // State for total number of entries

    const [openUpdateModal,setOpenUpdateModal] = useState(false);
    const [dataToBeUpdated,setDataUpdated] = useState({});

    const [isOpenChangeStatusModal,setIsOpenChangeStatusModal] = useState({
        isOpen:false,
        data:{}
    })

    const closeOpenUpdateModal = () =>{
        setOpenUpdateModal(false);
        setDataUpdated({});
    }

    const changeSearch = useCallback((value) => {
        setSearchParams((old) => ({ ...old, search: value }));
    }, [setSearchParams]);

    const changeSearchCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchCourse: value, }));

    }, [setSearchParams]);

    const coursesData = useSelector((state) => state.CourseSlice.data);


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;


    const fetchFacultyData = async () => {
        try {
            setIsDataLoading(true);
            const { search, searchCourse, } = searchParams;
            const course = searchCourse == 0 ? "" : searchCourse;

            const { data } = await axios.get(`${API_URL}/api/faculties/getFaculties`, {
                params: {
                    search,
                    course,
                    page: currentPage,
                    limit: entriesPerPage // Use selected entries per page
                },
                headers: {
                    "auth-token": token
                }
            });
            setFacultyData(data?.data);
            setTotalPages(Math.ceil(data.totalItems / entriesPerPage));
            setTotalEntries(data.totalItems);  // Update total pages based on selected entries per page
        } catch (error) {
            console.error("Error fetching student data:", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    const debouncedfetchFacultyData = useCallback(debounce(fetchFacultyData, 800), [searchParams, currentPage, entriesPerPage]);


    const courses = useMemo(() => {
        return transformCourseData(coursesData, true);
    }, [coursesData])

    useEffect(() => {
        setCurrentPage(1); // Reset current page when search parameters change
    }, [searchParams]);

    useEffect(() => {
        debouncedfetchFacultyData(); // Call the debounced function in useEffect
    }, [searchParams, currentPage, entriesPerPage]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSelectedPage(page); // Update the selected page number
    };

    const handleSelectedPageChange = (selectedPage) => {
        setSelectedPage(selectedPage);
        setCurrentPage(selectedPage);
    };

    const handleEntriesPerPageChange = (value) => {
        setEntriesPerPage(value);
        setCurrentPage(1); // Reset current page when entries per page changes
    };
    const getStartIndex = () => {
        return (currentPage - 1) * entriesPerPage + 1;
    };

    const getEndIndex = () => {
        const endIndex = currentPage * entriesPerPage;
        return Math.min(endIndex, totalEntries);
    };

    const closeChangeStatusModal = () =>{
        setIsOpenChangeStatusModal((old)=>({isOpen:false,data:{}}))
    }


    const updateStateData = useCallback((data)=>{
        if(!data){
            fetchFacultyData();
            return;
        }
        setFacultyData((old)=>{

            return old?.map((faculty)=>{
                return faculty._id === data._id ? data : faculty;
            })
        })
    },[])


    const user = useSelector((state)=>state.UserSlice);
    const navigate = useNavigate();
    const [showOverLay,setShowOverLay] = useState(true);
    
    useEffect(()=>{
        if(!user || user?.role === undefined || user?.role === "") return;
        if(user.role !== "Super Admin"){
            navigate("/home");
        }
        // console.log("called")
        setShowOverLay(false)
    },[user,navigate])
    return (
        <>
        {
            showOverLay
            &&
            <Overlay/>
        }
            <section className='mx-2 my-2 p-2'>
                <section className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3 lg:gap-5 p-2">
                    <Search placeholder="Search Faculty" searchValue={searchParams?.search} changeSearch={changeSearch} />
                    <Dropdown dataArr={courses} selected={searchParams.searchCourse} setSelected={changeSearchCourse} name="searchCourse" label="Select Course" passedId={true} />
                </section>


                <section className="overflow-x-auto max-h-[57vh] overflow-y-auto border border-blue-500 border-solid rounded-t-lg">
                    <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                        <thead className="bg-gradient-to-r from-cyan-500 to-blue-500  text-white">
                            <tr>
                                <th className="px-4 py-2 min-w-[5%]">Sr No</th>
                                <th className="px-4 py-2 min-w-[5%]">Salutation</th>
                                <th className="px-4 py-2 min-w-[30%]"> Name</th>
                                <th className="px-4 py-2 min-w-[10%]">Course</th>
                                <th className="px-4 py-2 min-w-[10%]">Phno</th>
                                <th className="px-4 py-2 min-w-[10%]">Email</th>
                                <th className="px-4 py-2 min-w-[10%]">Role</th>
                                <th className="px-4 py-2 min-w-[10%]">Update</th>
                                <th className="px-4 py-2 min-w-[10%]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {
                                isDataLoading ?
                                    [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12].map((skeleton, idx) => {
                                        return <tr key={idx}>
                                            <td className="border px-4 py-2 min-w-[5%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[5%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[30%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[10%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[10%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[10%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[10%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[10%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[10%]">
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
                                    facultyData?.map((faculty, idx) => (
                                        <tr key={faculty._id}>
                                            <td className="border px-4 py-2 min-w-[5%]">{idx + 1}</td>
                                            <td className="border px-4 py-2 min-w-[5%]">{faculty.salutation}</td>
                                            <td className="border px-4 py-2 min-w-[30%]">{faculty.name}</td>
                                            <td className="border px-4 py-2 min-w-[10%]">{faculty?.course?.courseName}</td>
                                            <td className="border px-4 py-2 min-w-[10%]">{faculty.phno}</td>
                                            <td className="border px-4 py-2 min-w-[10%]">{faculty.email}</td>
                                            <td className="border px-4 py-2 min-w-[10%]">{faculty.role}</td>
                                            <td className="border px-4 py-2 min-w-[10%]">
                                                <button
                                                    className='px-5 py-3 bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                                                    onClick={() => {
                                                        setOpenUpdateModal(true)
                                                        setDataUpdated((old)=>faculty)
                                                    }}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                            <td className="border px-4 py-2 min-w-[10%]">
                                                {
                                                    faculty.role !== "Super Admin"
                                                    &&
                                                    <ToggleSwitch
                                                        headingText={""}
                                                        selected={faculty.status === "Active"}
                                                        updateSelected={() => {
                                                            setIsOpenChangeStatusModal({
                                                                isOpen:true,
                                                                data:faculty
                                                            })
                                                        }}
                                                    />
                                                }
                                                <p className="my-1 text-center">{faculty.status}</p>
                                            </td>

                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </section>

                <section className='md:flex justify-between items-center gap-5 '>
                    <section className='flex justify-between items-center'>
                        <p className='text-nowrap mx-2'>No of Entries : </p>
                        <Dropdown
                            dataArr={[{ name: 15 }, { name: 30 }, { name: 50 }]} // Options for entries per page
                            selected={entriesPerPage}
                            setSelected={(value) => handleEntriesPerPageChange(Number(value))} // Convert value to number before setting
                            name="entriesPerPage"
                            label="Entries Per Page"
                        />
                    </section>
                    <section>
                        {totalEntries > 0 && (
                            <p className=" text-nowrap my-3">
                                Showing {getStartIndex()} - {getEndIndex()} of {totalEntries} Entries
                            </p>
                        )}
                    </section>
                    <section className="flex justify-center gap-3 mt-4 md:w-[30vw] float-right pb-8">
                        <button
                            className={`mx-1 px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500  text-white cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-500     hover:outline hover:outline-blue-500 text-white'}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <Dropdown
                            dataArr={Array.from({ length: totalPages }, (_, idx) => ({ name: idx + 1 }))}
                            selected={selectedPage}
                            setSelected={handleSelectedPageChange}
                            name="pageDropdown"
                            label="Go to Page"
                        />

                        <button
                            className={`mx-1 px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gradient-to-r from-cyan-500 to-blue-500  text-white cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-500     hover:outline hover:outline-blue-500 text-white'}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </section>
                </section>

            </section>
            <UpdateFaculty isOpen={openUpdateModal} close={closeOpenUpdateModal} heading={"Update Student Data"} dataToBeUpdated={dataToBeUpdated} updateStateData={updateStateData}/>
            <LockingConfirmation isOpen={isOpenChangeStatusModal.isOpen} close={closeChangeStatusModal} user={"Faculty"} data={isOpenChangeStatusModal.data} updateStateData={updateStateData}/>
        </>
    );
}


