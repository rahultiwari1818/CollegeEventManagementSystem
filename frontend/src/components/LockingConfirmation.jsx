import React from 'react'
import Modal from './Modal'
import axios from 'axios'
import { toast } from 'react-toastify';

export default function LockingConfirmation({ isOpen, close, user, data, updateStateData }) {

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_BASE_URL;
    const changeStatusHandler = async() => {

        try {
            const route = user === "Faculty" ? "faculties/changeStatus" : "students/changeStatus"
            const newStatus = data.status === "Active" ? "Inactive": "Active";
            const response = await axios.patch(`${API_URL}/api/${route}`,{
                id:data._id,
                newStatus
            },{
                headers:{
                    "auth-token":token
                }
            })

            if(response.data.result){
                toast.success(response.data.message);
                updateStateData(response.data.updatedFacultyData);
                close();
            }

        } catch ({response}) {
            toast.error(response.data.message)
        }

    }

    return (
        <Modal isOpen={isOpen} close={close} heading={"Change Status"}>
            <section className='my-2 mx-3 '>
                <p className="text-center text-red-500">Are You Sure To Change {user} Status ?</p>

                <section className='my-4 grid grid-cols-2 gap-5'>
                    <button className="px-5 py-3 rounded-lg shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500  text-white  hover:outline  hover:outline-blue-500"
                        onClick={() => {
                            updateStateData();
                        }}
                    >Cancel</button>
                    <button className="px-5 py-3 rounded-lg shadow-lg bg-red-500 text-white hover:text-red-500 hover:bg-white hover:outline  hover:outline-red-500"
                        onClick={changeStatusHandler}
                    >Change</button>
                </section>
            </section>
        </Modal>
    )
}
