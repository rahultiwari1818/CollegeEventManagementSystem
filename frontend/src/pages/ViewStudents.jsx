import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Search from '../components/Search';
import Dropdown from '../components/Dropdown'; // Import the Dropdown component
import { debounce, transformCourseData } from '../utils';
import Skeleton from 'react-loading-skeleton';
import Overlay from '../components/Overlay';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../store/CourseSlice';

export default function ViewStudents() {
    const [studentData, setStudentData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        search: "",
        searchCourse: "",
        searchSemester: "",
        searchdivision: ""
    });
    const [disablesection, setDisabledsection] = useState(true);
    const [division, setDivision] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(15); // State for selected entries per page
    const [totalEntries, setTotalEntries] = useState(0); // State for total number of entries

    const coursesData = useSelector((state)=>state.CourseSlice.data);
    const dispatch = useDispatch();

    const changeSearch = useCallback((value) => {
        setSearchParams((old) => ({ ...old, search: value }));
    }, [setSearchParams]);

    const changeSearchCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchCourse: value,searchSemester: "" ,searchdivision: "" }));
        
        if (value === "All") {
            setDisabledsection(true);
        } else {
            setDisabledsection(false);
        }
    }, [setSearchParams]);

    const changeSemesterCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchSemester: value ,searchdivision: ""}));
    }, [setSearchParams]);

    const changeSearchDivision = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchdivision: value }));
    });

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const fetchDivisions = async () => {
        try {
            const course = searchParams.searchCourse;
            const semester = searchParams.searchSemester;
            if (course === "All") return;
            const { data } = await axios.get(`${API_URL}/api/students/getDivisions?course=${course}&semester=${semester}`, {
                headers: {
                    "auth-token": token
                }
            });
            const divisionsArr = [{ name: "All" }, ...data?.data.map(section => ({ name: section }))];
            setDivision(divisionsArr);
        } catch (error) {
            console.error("Error fetching divisions:", error);
        }
    };

    const fetchStudentData = async () => {
        try {
            setIsDataLoading(true);
            const { search, searchCourse, searchSemester, searchdivision } = searchParams;
            const course = searchCourse === "All" ? "" : searchCourse;
            const semester = searchSemester === "All" ? "" : searchSemester;
            const section = searchdivision === "All" ? "" : searchdivision;

            const { data } = await axios.get(`${API_URL}/api/students/getStudents`, {
                params: {
                    search,
                    course,
                    semester,
                    division: section,
                    page: currentPage,
                    limit: entriesPerPage // Use selected entries per page
                },
                headers: {
                    "auth-token": token
                }
            });
            setStudentData(data?.data);
            setTotalPages(Math.ceil(data.totalItems / entriesPerPage));
            setTotalEntries(data.totalItems);  // Update total pages based on selected entries per page
        } catch (error) {
            console.error("Error fetching student data:", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    const debouncedFetchStudentData = useCallback(debounce(fetchStudentData, 800), [searchParams, currentPage, entriesPerPage]);

    useEffect(() => {
        fetchDivisions();
    }, [searchParams.searchCourse,searchParams.searchSemester]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when search parameters change
    }, [searchParams]);

    useEffect(() => {
        debouncedFetchStudentData(); // Call the debounced function in useEffect
    }, [searchParams, currentPage, entriesPerPage]);

    useEffect(()=>{
        dispatch(fetchAllCourses());
    },[dispatch])

    const courses = useMemo(()=>{
        return transformCourseData(coursesData,true);
    },[coursesData])

    // const courses = [{ name: "All" }, { name: "BCA" }, { name: "BBA" }, { name: "BcomGujaratiMed" }, { name: "BcomEnglishMedium" }];

    const semestersArr = useMemo(() => {
        for (let course of coursesData) {
            if (course.courseName === searchParams.searchCourse) {
                let semesters = [];
                for (let i = 1; i <= course.noOfSemesters; i++) {
                    semesters.push({ name: i });
                }
                return semesters;
            }
        }
        return [];
    }, [searchParams.searchCourse,coursesData])

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


    return (
        <>
            <section className='mx-2 my-2 p-2'>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-5 p-2">
                    <Search placeholder="Search Student" searchValue={searchParams?.search} changeSearch={changeSearch} />
                    <Dropdown dataArr={courses} selected={searchParams.searchCourse} setSelected={changeSearchCourse} name="searchCourse" label="Select Course" />
                    <Dropdown dataArr={semestersArr} selected={searchParams.searchSemester} setSelected={changeSemesterCourse} name="searchSemester" label="Select Semester" />
                    <Dropdown dataArr={division} selected={searchParams.searchdivision} setSelected={changeSearchDivision} name="searchdivisions" label="Select Division" disabled={disablesection} />
                </section>


                <section className="overflow-x-auto max-h-[57vh] overflow-y-auto border border-blue-500 border-solid rounded-t-lg">
                    <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-2 min-w-[7%]">Sr No</th>
                                <th className="px-4 py-2 min-w-[15%]">SID</th>
                                <th className="px-4 py-2 min-w-[31%]">Student Name</th>
                                <th className="px-4 py-2 min-w-[10%]">Course</th>
                                <th className="px-4 py-2 min-w-[7%]">Sem</th>
                                <th className="px-4 py-2 min-w-[5%]">section</th>
                                <th className="px-4 py-2 min-w-[5%]">Roll No</th>
                                <th className="px-4 py-2 min-w-[15%]">Phone Number</th>
                                <th className="px-4 py-2 min-w-[5%]">Gender</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {
                                isDataLoading ?
                                    [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12].map((skeleton, idx) => {
                                        return <tr key={idx}>
                                            <td className="border px-4 py-2 min-w-[7%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[15%]">
                                                <Skeleton
                                                    count={1}
                                                    height="50%"
                                                    width="100%"
                                                    baseColor="#4299e1"
                                                    highlightColor="#f7fafc"
                                                    duration={0.9}
                                                />
                                            </td>
                                            <td className="border px-4 py-2 min-w-[31%]">
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
                                            <td className="border px-4 py-2 min-w-[7%]">
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
                                            <td className="border px-4 py-2 min-w-[15%]">
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

                                        </tr>
                                    })
                                    :
                                    studentData?.map((student, idx) => (
                                        <tr key={student._id}>
                                            <td className="border px-4 py-2 min-w-[7%]">{idx + 1}</td>
                                            <td className="border px-4 py-2 min-w-[15%]">{student.sid}</td>
                                            <td className="border px-4 py-2 min-w-[31%]">{student.studentName}</td>
                                            <td className="border px-4 py-2 min-w-[10%]">{student.course}</td>
                                            <td className="border px-4 py-2 min-w-[7%]">{student.semester}</td>
                                            <td className="border px-4 py-2 min-w-[5%]">{student.division}</td>
                                            <td className="border px-4 py-2 min-w-[5%]">{student.rollno}</td>
                                            <td className="border px-4 py-2 min-w-[15%]">{student.phno}</td>
                                            <td className="border px-4 py-2 min-w-[5%]">{student.gender}</td>
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
                            selected={entriesPerPage.toString()}
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
                            className={`mx-1 px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-blue-500 text-white cursor-not-allowed' : 'bg-blue-500 hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500 text-white'}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <Dropdown
                            dataArr={Array.from({ length: totalPages }, (_, idx) => ({ name: idx + 1 }))}
                            selected={selectedPage.toString()}
                            setSelected={handleSelectedPageChange}
                            name="pageDropdown"
                            label="Go to Page"
                        />

                        <button
                            className={`mx-1 px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-blue-500 text-white cursor-not-allowed' : 'bg-blue-500 hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500 text-white'}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </section>
                </section>

            </section>
        </>
    );
}
