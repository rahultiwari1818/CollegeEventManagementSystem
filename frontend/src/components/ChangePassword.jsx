import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Modal from '../components/Modal';
import { toast } from "react-toastify";
import Overlay from './Overlay';
import { isValidPassword } from '../utils';

export default function ChangePassword({ isOpen, close, heading }) {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: ""
    })

    const [newPasswordErr, setNewPasswordErr] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state) => state.UserSlice);

    const updateData = (e) => {
        const { name, value } = e.target;
        setPasswordData((old) => ({ ...old, [name]: value }))
    }

    const handleChangePassword = async () => {

        if(!isValidPassword(passwordData.newPassword)){
            setNewPasswordErr(`Password Should Have at least 1 UpperCase Letter , 1 LowerCase Letter , 1 Digit and 1 Special Character.
            its length should be greater than 8`);
            return;
        }
        else{
            setNewPasswordErr("")
        }
        
        try{
            setIsLoading(true)
        const route = user.role === "Student" ? `students/changePassword` : `faculties/changePassword`;

        const {data} = await axios.post(`${API_URL}/api/${route}`,passwordData,{
            headers:{
                "auth-token":token,
            }
        })

        if(data.result){
            toast.success(data.message);
            
            close();
        }

    } catch ({response}) {
        toast.error(response?.data.message)
    }
    finally {
            setIsLoading(false);
        }

    }

    useEffect(()=>{
        if(!isOpen){
            setNewPasswordErr("");
            setPasswordData({
                currentPassword:"",
                newPassword:""
            })
        }
    },[isOpen])

    return (
        <>

            {
                isLoading
                &&
                <Overlay />
            }

            <Modal isOpen={isOpen} close={close} heading={heading}>
                <section>
                <section className='mx-2 my-2'>
                        <label htmlFor="currentPassword" className="block mb-1">Current Password:</label>
                        <input type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={updateData}
                            className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                            placeholder='Enter Current  Password '
                            required
                         />

                    </section>
                    <section className='mx-2 my-2'>
                        <label htmlFor="newPassword" className="block mb-1">New Password:</label>
                        <input type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={updateData}
                            className="w-full px-3 py-2  rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
                            placeholder='Enter New Password '
                            required
                         />
                        {
                            newPasswordErr !== ""
                            &&
                            <p className="text-red-500 my-3">
                                {newPasswordErr}
                            </p>
                        }
                    </section>
                    <section className="my-2">
                        <button className="block w-full py-2 bg-red-500 text-white rounded-lg shadow-lg hover:text-red-500 hover:bg-white hover:outline hover:outline-red-500"
                        onClick={handleChangePassword}
                        >
                            Update Password
                        </button>
                    </section>
                </section>
            </Modal>
        </>
    )
}
