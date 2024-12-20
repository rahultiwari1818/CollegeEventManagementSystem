import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import Dropdown from './Dropdown'
import { handleNumericInput, isValidPassword } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ForgotPassword({ openForgotPasswordModal, setOpenForgotPasswordModal }) {


    useEffect(()=>{
        setData({
            role: "",
            phno: "",
            sid: "",
            email: "",
            otp: ""
        })
        setErrors({
            sidErr: "",
            emailErr: "",
            otpErr: "",
            roleErr:""
        })

          setDisableRole(false);
          setOtpSent(false);
          setOtpVerified(false);
         setNewPassword("");
    },[openForgotPasswordModal])

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
        otpErr: "",
        roleErr:"",
        needStrongPasswordErr:false
    })
    const [disableRole, setDisableRole] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((old) => ({ ...old, [name]: value }))
    }


    const API_URL = process.env.REACT_APP_BASE_URL;

    const sendOTPHandler = async () => {
        if(data.role === ""){
            setErrors((old)=>({...old,roleErr:"Select Your Role."}));
            return;
        }
        else{
            setErrors((old)=>({...old,roleErr:""}));
        }
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
        } catch ({response}) {
            toast.error(response.data?.message);
            setOpenForgotPasswordModal(false);
        }


    }

    const verifyOTPHandler = async () => {
        otpRef.current.disabled = true;
        verifyOTPBtnRef.current.disabled = true;
        const route = data.role === "Faculty" ? "faculties" : "students";
        const payload = {
            otp: data.otp
        };
        data.role === "Faculty" ?
        payload.email = data.email
        :
        payload.sid = data.sid;

        try {

            const response = await axios.post(`${API_URL}/api/${route}/verifyOTP`, payload);
            // console.log(data)
            if (!response.data.result) {

                otpRef.current.disabled = false;
                verifyOTPBtnRef.current.disabled = false;
                toast.error(response.data.message)
            }
            else {
                toast.success(response.data.message)
                setOtpVerified(true);
                localStorage.setItem("token",response.data.token)
            }
        }
        catch (err) {

        }
    }

    const passwordResetHandler = async()=>{
        // Need To Implement Password Validation

        if(!isValidPassword(newPassword)){
            setErrors((old)=>({...old,needStrongPasswordErr:true}))
            return;
        }
        else{
            setErrors((old)=>({...old,needStrongPasswordErr:false}))
        }


        passwordResetBtnRef.current.disabled = true;
        newPasswordRef.current.disabled = true;
        const route = data.role === "Faculty" ? "faculties" : "students";
        const token = localStorage.getItem("token");
        console.log(token);
        try {
            
            const response = await axios.post(`${API_URL}/api/${route}/resetPassword`,{newPassword:newPassword}, {
                headers: {
                  "auth-token": token
                }
              })

            if(!response.data.result){
                toast.error(response.data.message);
            }
            else{
                toast.success(response.data.message);
                localStorage.removeItem("token");
                setOpenForgotPasswordModal(false)
            }

        } catch (error) {
            
        }
    }

    const changeRole = useCallback((value) => {
        setData((old) => ({ ...old, role: value }))

    })

    const sidRef = useRef(null);
    const emailRef = useRef(null);
    const sendOTPBtnRef = useRef(null);
    const otpRef = useRef(null);
    const verifyOTPBtnRef = useRef(null);
    const newPasswordRef = useRef(null);
    const passwordResetBtnRef = useRef(null);
    const roles = [{ name: "Faculty" }, { name: "Student" }];

    return (
        <Modal isOpen={openForgotPasswordModal} close={setOpenForgotPasswordModal} heading={"Forgot Password"}>
            {
                !otpVerified ?
                    <section className='p-3'>
                        <section className="px-3 my-2">
                            <label className='mx-2'>Select Your Role : </label>
                            <Dropdown dataArr={roles} selected={data?.role} setSelected={changeRole} label={"Select Your Role"} disabled={disableRole} />
                            {
                                errors.roleErr !== ""
                                &&
                                <p className="text-red-500 my-2">
                                    {
                                        errors.roleErr
                                    }
                                </p>
                            }
                        </section>
                        {
                            data && data?.role === "Student" &&
                            <section className="px-3 my-4">
                                <label className='mx-2'>Enter Your SID : </label>
                                <input type="text" name="sid" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter Your Sid' value={data?.sid} onChange={updateData} onKeyDown={handleNumericInput} ref={sidRef} required />
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
                                <input type="email" name="email" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter Your Registered Email' value={data?.email} onChange={updateData} ref={emailRef} required />
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
                    :
                    <section className="p-3">
                        <section className="px-3 my-2">
                            <label htmlFor="newPassword" className='mx-2'>New Password : </label>
                            <input type="password" name="newPassword" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter New Password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} 
                            ref={newPasswordRef}
                            required />
                            {
                                errors.needStrongPasswordErr 
                                &&
                                <p className="text-red-500 m-2">
                                    Password Should Have at least 1 UpperCase Letter , 1 LowerCase Letter , 1 Digit and 1 Special Character.
                                    its length should be greater than 8
                                </p>
                            }

                        </section>
                        <section className="px-3 my-2">
                        <button className='px-5 py-2 bg-green-500 text-white rounded-lg shadow-md'
                        ref={passwordResetBtnRef}
                        onClick={passwordResetHandler}
                        >
                            Reset Password </button>
                        </section>
                    </section>
            }

        </Modal>
    )
}
