import React, { useEffect, useState } from 'react'
import Overlay from '../components/Overlay'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function EventResultDeclaration() {

    const [eventData,setEventData] = useState([]);
    const [showOverLay, setShowOverLay] = useState(true)
    const userData = useSelector((state) => state.UserSlice);
    const navigate = useNavigate();



    useEffect(() => {
        if (!userData || userData?.role === "" || userData?.role === undefined) return;
        if (userData.role === "Student") {
            alert(JSON.stringify(userData))
            navigate("/home");
        }
        setShowOverLay(false);
    }, [userData, navigate]);

    return (
        <>
            {
                showOverLay
                &&
                <Overlay />
            }
            <section className='my-2'>

            </section>
        </>
    )
}
