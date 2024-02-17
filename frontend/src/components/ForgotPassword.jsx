import React, { useCallback, useRef, useState } from 'react'
import Modal from './Modal'
import Dropdown from './Dropdown'
import { handleNumericInput } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ForgotPassword({ openForgotPasswordModal, setOpenForgotPasswordModal }) {


    const [data, setData] = useState({
        role: "",
        phno: "",
        sid: "",
        email: "",
        otp: ""
    });

    const [errors, setErrors] = useState({
        sidErr: "",
        emailErr: "",
        otpErr: ""
    })
    const [disableRole, setDisableRole] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((old) => ({ ...old, [name]: value }))
    }


    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");

    const sendOTPHandler = async () => {
        if (data?.role === "Faculty") {
            emailRef.current.disabled = true;
        }
        else {
            sidRef.current.disabled = true;
        }
        setDisableRole(true);
        sendOTPBtnRef.current.disabled = true;
        const route = data.role === "Faculty" ? "faculties" : "students";
        const payload = data.role !== "Faculty" ? {
            sid: data.sid
        }
            :
            {
                email: data.email
            };

        try {

            const response = await axios.post(`${API_URL}/api/${route}/forgotPassword`, payload);
            // console.log(data)
            if (!response.data.result) {
                setDisableRole(false);

                if (data.role === "Faculty") {
                    setErrors((old) => ({ ...old, emailErr: response.data.message }))
                    emailRef.current.disabled = false;

                }
                else {
                    sidRef.current.disabled = false;
                    setErrors((old) => ({ ...old, sidErr: response.data.message }))
                }
            }
            else {
                toast.success(response.data.message)
                setOtpSent(true);
            }
        } catch (error) {

        }


    }

    const verifyOTPHandler = async()=>{
        
    }

    const changeRole = useCallback((value) => {
        setData((old) => ({ ...old, role: value }))

    })

    const sidRef = useRef(null);
    const emailRef = useRef(null);
    const sendOTPBtnRef = useRef(null);
    const otpRef = useRef(null);
    const verifyOTPBtnRef = useRef(null);
    const roles = [{ name: "Faculty" }, { name: "Student" }];

    return (
        <Modal isOpen={openForgotPasswordModal} close={setOpenForgotPasswordModal} heading={"Forgot Password"}>
            <section className='p-3'>
                <section className="px-3 my-2">
                    <label className='mx-2'>Select Your Role : </label>
                    <Dropdown dataArr={roles} selected={data?.role} setSelected={changeRole} label={"Select Your Role"} disabled={disableRole} />
                </section>
                {
                    data && data?.role === "Student" &&
                    <section className="px-3 my-4">
                        <label className='mx-2'>Enter Your SID : </label>
                        <input type="text" name="sid" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter Your Sid' value={data?.sid} onChange={updateData} onKeyDown={handleNumericInput} ref={sidRef} />
                        {
                            errors.sidErr !== ""
                            &&
                            <p className="text-red-500">
                                {errors.sidErr}
                            </p>
                        }
                    </section>
                }
                {
                    data && data?.role === "Faculty"
                    &&
                    <section className="px-3 my-4">
                        <label className='mx-2'>Enter Your Registered Email ID : </label>
                        <input type="email" name="email" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter Your Registered Email' value={data?.email} onChange={updateData} ref={emailRef} />
                        {
                            errors.emailErr !== ""
                            &&
                            <p className="text-red-500">
                                {errors.emailErr}
                            </p>
                        }
                    </section>
                }
                <section className="px-3 my-4">
                    <button className='px-5 py-2 bg-green-500 text-white rounded-lg shadow-md'
                        ref={sendOTPBtnRef}
                        onClick={sendOTPHandler}
                    >
                        Send OTP
                    </button>
                </section>
                {

                    otpSent &&
                    <>
                    <section className='px-3 my-4'>
                        <label className='mx-2'>Enter Your OTP : </label>
                        <input type="text" name="otp" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter Your OTP' value={data?.otp} onChange={updateData} onKeyDown={handleNumericInput} ref={otpRef} />
                        {
                            errors.otpErr !== ""
                            &&
                            <p className="text-red-500">
                                {errors.otpErr}
                            </p>
                        }          
                    </section>
                                    <section className="my-4 px-3">
                                    <button className='px-5 py-2 bg-green-500 text-white rounded-lg shadow-md'
                                    onClick={verifyOTPHandler}
                                    ref={verifyOTPBtnRef}>
                                        Verify OTP
                                    </button>
                                </section>
                                </>
                    
                }

            </section>

        </Modal>
    )
}
