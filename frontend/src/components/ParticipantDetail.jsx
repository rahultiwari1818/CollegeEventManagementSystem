import React, { useEffect, useState } from 'react'
import ComboboxComp from './Combobox'
import { useSelector } from 'react-redux'
import axios from 'axios';

export default function ParticipantDetail({noOfParticipants}) {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const user = useSelector((state) => state.UserSlice);
    const [participantsData,setParticipantData] = useState([{}]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {

                
                const { data } = await axios.get(`${API_URL}/api/students/getSpecificStudents/${user._id}`, {
                    headers: {
                        "auth-token": token
                    }
                })

                setParticipantData((old)=>{
                    const newData = old.shift();
                    const appendedData = old.unshift(data.data);
                    return appendedData;
                })
            } catch (error) {

            }

        }
        
        fetchUserData();
        
    }, [user])



  return (
    <section>
        <ComboboxComp  placeholder={"Enter SID"} disabled={true} selectedData={participantsData[0]} />
        {
            Array.from({ length: noOfParticipants-1 }, (_, index) => index + 1).map((participant,idx)=>{
                return         <ComboboxComp placeholder="Enter SID"/>
            })
        }

    </section>
  )
}
