import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import Search from './Search';
import Dropdown from './Dropdown';
import { debounce } from '../utils';
import Skeleton from 'react-loading-skeleton';

export default function ViewStudents() {

    const [studentData, setStudentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        search: "",
        searchCourse: "",
        searchSemester: "",
        searchDivision:""
    });
    const [disableDiv,setDisabledDiv] = useState(true);
    const [division,setDivision] = useState([]);

    const changeSearch = useCallback((value) => {
        setSearchParams((old) => ({ ...old, search: value }));
    }, [setSearchParams]);

    const changeSearchCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchCourse: value }));
        if(value==="All"){
            setDisabledDiv((old)=>true);
        }
        else{
            setDisabledDiv((old)=>false);
        }
    }, [setSearchParams]);

    const changeSemesterCourse = useCallback((value) => {
        setSearchParams((old) => ({ ...old, searchSemester: value }));
    }, [setSearchParams]);

    const changeSearchDivision = useCallback((value)=>{
        setSearchParams((old)=>({...old,searchDivision:value}));
    })

    // const changeSearchCourse = useCallback((value)=>{
    //     setSearchParams((old) => ({ ...old, searchCourse: value }));
    // },[setSearchParams])


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;


    const fetchDivisions = async()=>{

        try {
            
            const course = searchParams.searchCourse;
            if(course==="All") return ;
            const { data } = await axios.get(`${API_URL}/api/students/getDivisions?course=${course}`, {
                headers: {
                    "auth-token": token
                }
            })
            console.log(data?.data)
            const divisionsArr = new Array();
            divisionsArr.push({name:"All"});
            data?.data.forEach(div => {
                divisionsArr.push({name:div});
            });
            setDivision(()=>divisionsArr);
        } catch (error) {
            
        }

    }   

    const fetchStudentData = async () => {

        try {
            const search = searchParams.search;
            let course = searchParams.searchCourse;
            let semester = searchParams.searchSemester;
            let div = searchParams.searchDivision;

            if (course === "All") {
                course = "";
            }
            if (semester === "All") {
                semester = "";
            }
            if(div==="All"){
                div="";
            }

            const { data } = await axios.get(`${API_URL}/api/students/getStudents?search=${search}&course=${course || ""}&semester=${semester}&division=${div}`, {
                headers: {
                    "auth-token": token
                }
            })
            console.log(data.data)
            setStudentData(() => data?.data)
        } catch (error) {

        }
        finally {
            setIsLoading((old) => false);
        }
    }
    const debouncedFetchStudentData = (debounce(fetchStudentData, 800));

    useEffect(() => {
        debouncedFetchStudentData(); // Call the debounced function in useEffect
        fetchDivisions();
    }, [searchParams]);

    const courses = [{ name: "All" }, { name: "BCA" }, { name: "BBA" }, { name: "BcomGujaratiMed" }, { name: "BcomEnglishMedium" }];
    const semesters = [{ name: "All" }, { name: "Sem-I" }, { name: "Sem-II" }, { name: "Sem-III" }, { name: "Sem-IV" }, { name: "Sem-V" }, { name: "Sem-VI" }]

    return (
        <section className='mx-2 my-2 p-2'>

            <section className='p-2 md:flex gap-5 '>

                <Search placeholder={"Search Student "} searchValue={searchParams?.search} changeSearch={changeSearch} />

                <Dropdown dataArr={courses} selected={searchParams.searchCourse} setSelected={changeSearchCourse} name={"searchCourse"} label={"Select Course"} />
                <Dropdown dataArr={semesters} selected={searchParams.searchSemester} setSelected={changeSemesterCourse} name={"searchSemester"} label={"Select Semester"} />
                <Dropdown dataArr={division} selected={searchParams.searchDivision} setSelected={changeSearchDivision} name={"searchDivisions"} label={"Select Division"}  disabled={disableDiv}/>
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
                            <th className="px-4 py-2 min-w-[5%]">Div</th>
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

        </section>
    )
}
