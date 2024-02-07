import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import Search from './Search';
import Dropdown from './Dropdown';
import { debounce } from '../utils';
import Skeleton from 'react-loading-skeleton';
import Overlay from './Overlay';

export default function ViewStudents() {

    const [studentData, setStudentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        search: "",
        searchCourse: "",
        searchSemester: "",
        searchdivision: ""
    });
    const [disablesection, setDisabledsection] = useState(true);
    const [division, setdivision] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const changeSearch = useCallback((value) => {
        setSearchParams((old) => ({ ...old, search: value }));
    }, [setSearchParams]);

    const changeSearchCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchCourse: value }));
        if (value === "All") {
            setDisabledsection((old) => true);
        }
        else {
            setDisabledsection((old) => false);
        }
    }, [setSearchParams]);

    const changeSemesterCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchSemester: value }));
    }, [setSearchParams]);

    const changeSearchdivision = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchdivision: value }));
    });

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const fetchdivisions = async () => {
        try {
            const course = searchParams.searchCourse;
            if (course === "All") return;
            const { data } = await axios.get(`${API_URL}/api/students/getDivisions?course=${course}`, {
                headers: {
                    "auth-token": token
                }
            })
            console.log(data?.data)
            const divisionsArr = new Array();
            divisionsArr.push({ name: "All" });
            data?.data.forEach(section => {
                divisionsArr.push({ name: section });
            });
            setdivision(() => divisionsArr);
        } catch (error) {
            console.error("Error fetching divisions:", error);
        }
    }

    const fetchStudentData = async () => {
        try {
            const search = searchParams.search;
            let course = searchParams.searchCourse;
            let semester = searchParams.searchSemester;
            let section = searchParams.searchdivision;

            if (course === "All") {
                course = "";
            }
            if (semester === "All") {
                semester = "";
            }
            if (section === "All") {
                section = "";
            }

            const { data } = await axios.get(`${API_URL}/api/students/getStudents`, {
                params: {
                    search: search,
                    course: course || "",
                    semester: semester,
                    division: section,
                    page: currentPage,
                    limit: 10 // Adjust the limit as needed
                },
                headers: {
                    "auth-token": token
                }
            });
            console.log(data.data);
            setStudentData(() => data?.data);
            setTotalPages(() => Math.ceil(data.totalItems / 10)); // Assuming 10 items per page
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
        finally {
            setIsLoading(() => false);
        }
    }

    const debouncedFetchStudentData = useCallback(debounce(fetchStudentData, 800), [searchParams, currentPage]);

    useEffect(() => {
        fetchdivisions();
    }, [searchParams.searchCourse]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when search parameters change
    }, [searchParams]);

    useEffect(() => {
        debouncedFetchStudentData(); // Call the debounced function in useEffect
    }, [searchParams, currentPage]);

    const courses = [{ name: "All" }, { name: "BCA" }, { name: "BBA" }, { name: "BcomGujaratiMed" }, { name: "BcomEnglishMedium" }];
    const semesters = [{ name: "All" }, { name: "Sem-I" }, { name: "Sem-II" }, { name: "Sem-III" }, { name: "Sem-IV" }, { name: "Sem-V" }, { name: "Sem-VI" }];

    const handlePageChange = (page) => {
        setCurrentPage(() => page);
    };

    return (
        <>
            {/* {
                isLoading
                &&
                <Overlay/>
            } */}
            <section className='mx-2 my-2 p-2'>

                <section className='p-2 md:flex gap-5 '>

                    <Search placeholder={"Search Student "} searchValue={searchParams?.search} changeSearch={changeSearch} />

                    <Dropdown dataArr={courses} selected={searchParams.searchCourse} setSelected={changeSearchCourse} name={"searchCourse"} label={"Select Course"} />
                    <Dropdown dataArr={semesters} selected={searchParams.searchSemester} setSelected={changeSemesterCourse} name={"searchSemester"} label={"Select Semester"} />
                    <Dropdown dataArr={division} selected={searchParams.searchdivision} setSelected={changeSearchdivision} name={"searchdivisions"} label={"Select Division"} disabled={disablesection} />
                </section>

                <section className="overflow-x-auto">
                    <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700">
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
                                isLoading ?
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
                <section className="flex justify-center mt-4">
    {/* Previous page button */}
    <button
        className={`mx-1 px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-blue-500 text-white cursor-not-allowed' : 'bg-blue-500 hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500 text-white'}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
    >
        Previous
    </button>

    {/* Starting pages */}
    {Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1).map((page) => (
        <button
            key={page}
            className={`mx-1 px-3 py-1 rounded-md ${currentPage === page ? 'bg-gray-400 text-white' : 'bg-blue-500 hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500 text-white'}`}
            onClick={() => handlePageChange(page)}
        >
            {page}
        </button>
    ))}

    {/* Next page button */}
    <button
        className={`mx-1 px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-blue-500 text-white cursor-not-allowed' : 'bg-blue-500 hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500 text-white'}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
    >
        Next
    </button>
</section>




            </section>
        </>

    )
}
