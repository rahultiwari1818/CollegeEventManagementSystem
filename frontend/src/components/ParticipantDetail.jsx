import React, { useCallback, useEffect, useState } from 'react';
import ComboboxComp from './Combobox';
import axios from 'axios';
import { debounce } from '../utils';
import { toast } from 'react-toastify';

export default function ParticipantDetail({ noOfParticipants, studentData, eventData }) {


    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [registrationData, setRegistrationData] = useState([]);
    const [registrationDataError, setRegistrationDataError] = useState([]);

    const [filteredStudents, setFilteredData] = useState([]);


    useEffect(() => {
        if (!studentData) return;
        // console.log(studentData,"registration")
        const array = [studentData];
        const errorArray = [""];
        for (let i = 1; i < noOfParticipants; i++) {
            array.push({});
            errorArray.push(`Participant ${i + 1}'s Detail Required.!`);
        }
        setRegistrationData((old) => array)
        setRegistrationDataError((old) => errorArray);
        // console.log("registrationData",registationData,studentData);
    }, [noOfParticipants, studentData, eventData])


    const updateRegistrationData = useCallback((index, data) => {
        let isValid = false;
        setRegistrationData((old) => {
            let flag = false;

            for (let regData of old) {
                if (regData.sid === data.sid) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                const mappedData = old?.map((regData, idx) => {
                    return idx === Number(index) ? data : regData;
                })
                isValid = true;
                return mappedData;
            }
            else {

                const mappedData = old?.map((regData, idx) => {
                    return (idx === Number(index) && idx !== 0) ? {} : regData;
                })
                return mappedData;

            }
        })

        if (isValid) {
            setRegistrationDataError((old) => {
                const mappedData = old?.map((err, idx) => {
                    return idx === Number(index) ? "" : err;
                })
                return mappedData;
            })
        }
        else {
            setRegistrationDataError((old) => {
                const mappedData = old?.map((err, idx) => {
                    return idx === Number(index) ? `Participant Already Added.!` : err;
                })
                return mappedData;
            })
        }

    }, [])

    const searchStudent = useCallback(
        debounce((query) => {
            const fetchStudentData = async () => {
                try {
                    const course = registrationData[0]?.courseId;
                    const semester = registrationData[0]?.semester;
                    const sid = query;
                    const division =
                        eventData?.etype === "Intra-College"
                            ? registrationData[0]?.division
                            : "";
                    const { data } = await axios.get(
                        `${API_URL}/api/students/getStudents`,
                        {
                            params: {
                                sid,
                                semester,
                                course,
                                division,
                                status:"Active",
                                limit: 10, // Use selected entries per page
                            },
                            headers: {
                                "auth-token": token,
                            },
                        }
                    );
                    setFilteredData((old) => data.data);
                } catch (error) {
                    console.log("Error fetching student data:", error);
                }
            };
            if (!registrationData[0]?.sid) return;
            fetchStudentData();
        }, 800),
        [registrationData, eventData, token, API_URL, studentData]
    );


    const handleFormSubmission = async () => {
        if (registrationData.every((err) => err.length === 0)) return;

        try {

            const registeredStudents = [];
            registrationData.forEach((student)=>{
                registeredStudents.push(student._id);
            })
            const dataToPost = {};
            dataToPost["hasSubEvents"] = eventData.hasSubEvents;
            if (eventData.hasSubEvents) {
                dataToPost["eventId"]=eventData.eventId;
                dataToPost["sId"]=eventData.sId;
                dataToPost["subEventName"]=eventData.subEventName;
            }
            else {
                dataToPost["eventId"]=eventData._id;
            }
            dataToPost["ename"]=eventData.ename;
            dataToPost["studentData"]= JSON.stringify(registeredStudents);
            const { data } = await axios.post(`${API_URL}/api/events/registerInEvent`, dataToPost, {
                headers:{
                    "auth-token":token
                }
            })

            if (data.result) {
                toast.success(data.message);
                setRegistrationData([studentData])
            }
            else {
                toast.error(data.message)
            }

        } catch ({response}) {
            toast.error(response.data.message)
        }


    }

    return (
        <section>
            <section className='px-2 py-1 shadow-lg rounded-lg border border-blue-500'>

                <ComboboxComp
                    placeholder="Enter SID"
                    disabled={true}
                    label={`Participant 1 SID :`}
                    peopleData={[]}
                    studentData={registrationData[0]}
                    index={0}
                    updateRegistrationData={updateRegistrationData}
                    searchStudents={searchStudent}
                />
                {
                    registrationData[0]?.sid !== ""
                    &&
                    <section className='grid grid-cols-1 md:grid-cols-2 my-2 '>
                        <p> Name : {registrationData[0]?.name}</p>
                        <p> Semester : {registrationData[0]?.semester}</p>
                        <p> Div : {registrationData[0]?.division}</p>
                    </section>
                }
            </section>
            {Array.from({ length: noOfParticipants - 1 }, (_, index) => index + 2).map((participant, idx) => {
                return (
                    <section className='px-2 py-1 shadow-lg rounded-lg my-3 border border-blue-500' key={idx}>
                        <ComboboxComp
                            placeholder="Enter SID"
                            label={`Participant ${idx + 2} SID :`}
                            peopleData={filteredStudents}
                            index={idx + 1}
                            updateRegistrationData={updateRegistrationData}
                            searchStudents={searchStudent}
                        />
                        {
                            studentData?.sid !== ""
                            &&
                            <section className='grid grid-cols-1 md:grid-cols-2 my-2 '>
                                <p> Name : {registrationData[idx + 1]?.studentName}</p>
                                <p> Semester : {registrationData[idx + 1]?.semester}</p>
                                <p> Div : {registrationData[idx + 1]?.division}</p>
                            </section>
                        }
                        <>
                            {
                                registrationDataError[idx + 1] !== ""
                                &&
                                <p className="text-red-500 py-2">
                                    {registrationDataError[idx + 1]}
                                </p>
                            }
                        </>


                    </section>
                )

            })}
            <button
                className='w-full block text-white bg-red-500 shadow-lg rounded-lg hover:text-red-500 hover:bg-white hover:outline hover:outline-red-500 py-3 my-3'
                onClick={handleFormSubmission}
            >
                Request Registration
            </button>
        </section>
    );
}
