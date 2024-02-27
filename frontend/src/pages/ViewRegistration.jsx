import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Overlay from '../components/Overlay';

export default function ViewRegistration() {
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;

    const [registrationData, setRegistrationData] = useState([]);
    const [eventData, setEventData] = useState({
        ename: "",
        hasSubEvents: ""
    });
    const { eventId } = useParams();

    useEffect(() => {

        const fetchRegistrationDetails = async () => {

            try {

                const { data } = await axios.get(`${API_URL}/api/events/getRegistrationDataOfEvent/${eventId}`, {
                    headers: {
                        "auth-token": token
                    }
                })
                console.log("data data", data.data)
                if (data.result) {
                    setEventData((old) => ({ ...old, ename: data.data[0].ename }))

                    if (data.data[0]?.sId) {
                        setEventData((old) => ({ ...old, hasSubEvents: true }));
                        const map = {};
                        for (let subEvent of data.data) {
                            map[subEvent.sId] ? map[subEvent.sId].push(subEvent) : map[subEvent.sId] = [subEvent]
                        }

                        const events = Object.values(map);
                        setRegistrationData(events)
                    }
                    else {

                        setEventData((old) => ({ ...old, hasSubEvents: false }));
                        setRegistrationData(data.data)

                    }
                }

            } catch (error) {

            }

        }

        fetchRegistrationDetails();

    }, [eventId])


    return (
        <>
            {
                false &&
                <Overlay />
            }
            <section className='mb-5'>
                <section className="py-3 px-4 rounded-lg shadow-lg">
                    <p className=' text-base md:text-2xl text-center text-white bg-blue-500 p-2'>
                        Registration Requests of {eventData.ename}
                    </p>

                    {
                        eventData.hasSubEvents ?
                            <>
                                {
                                    registrationData?.map((subEvent) => {
                                        return (

                                            <section key={subEvent.sId} className='my-3 border border-blue-500 py-3 px-3 shadow-lg' >
                                                <p className=' text-base md:text-2xl text-center text-white bg-blue-500 p-2'>
                                                    Registration Requests of {subEvent[0].subEventName}
                                                </p>
                                                {
                                                    subEvent?.map((studentTeam) => {
                                                        return (<section className='w-full overflow-x-auto  overflow-y-auto my-3 '>
                                                            <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                                                                <thead className='bg-blue-500 text-white'>
                                                                    <tr>
                                                                        <td className='px-2 py-2 md:px-4'>
                                                                            Sr No
                                                                        </td>

                                                                        <td className='px-2 py-2 md:px-4'>
                                                                            SID
                                                                        </td>

                                                                        <td className='px-2 py-2 md:px-4'>
                                                                            Name
                                                                        </td>

                                                                        <td className='px-2 py-2 md:px-4'>
                                                                            Course
                                                                        </td>


                                                                        <td className='px-2 py-2 md:px-4'>
                                                                            Semester
                                                                        </td>
                                                                        <td className='px-2 py-2 md:px-4' >
                                                                            Approve or Reject
                                                                        </td>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        studentTeam.studentData?.map((team, idx) => {
                                                                            return <tr key={idx}>
                                                                                {idx == 0 && <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}>
                                                                                    {idx + 1}
                                                                                </td>
                                                                                }
                                                                                <td className='border px-2 py-2 md:px-4 '>
                                                                                    {
                                                                                        team.sid
                                                                                    }
                                                                                </td>
                                                                                <td className='border px-2 py-2 md:px-4 '>
                                                                                    {
                                                                                        idx == 0 ?
                                                                                            team.name : team.studentName
                                                                                    }
                                                                                </td>
                                                                                <td className='border px-2 py-2 md:px-4 '>
                                                                                    {
                                                                                        team.course
                                                                                    }
                                                                                </td>
                                                                                <td className='border px-2 py-2 md:px-4 '>
                                                                                    {
                                                                                        team.semester
                                                                                    }
                                                                                </td>
                                                                                {
                                                                                    idx == 0 &&
                                                                                    <td className='border px-2 py-2 md:px-4 ' rowSpan={studentTeam.studentData.length}  >

                                                                                    </td>
                                                                                }
                                                                            </tr>
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </section>)
                                                    })
                                                }
                                            </section>
                                        )
                                    })
                                }
                            </>
                            :
                            <>
                                {
                                    registrationData?.map((teams, idx) => {

                                    })
                                }
                            </>
                    }

                </section>

            </section>
        </>
    )
}
