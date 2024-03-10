import axios from 'axios';
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactComponent as LoginIcon } from "../assets/Icons/LoginIcon.svg";
import { setNewUser } from '../store/UserSlice';
import Overlay from "../components/Overlay"
import ForgotPassword from '../components/ForgotPassword';
import Dropdown from '../components/Dropdown';
import { handleNumericInput } from '../utils';
export default function Login() {

    const [data, setData] = useState({
        email: "",
        password: "",
        role: "",
        sid: ""
    });

    const [errors,setErrors] = useState({
        roleErr:"",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_BASE_URL;

    const updateData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }


    const submitHandler = async (e) => {
        e.preventDefault();
        if(data?.role===""){
            setErrors({
                roleErr:"Select Your Role."
            })
            return;
        }
        setIsLoading(() => true);

        const route = data?.role === "Faculty" ? "faculties" :"students";

        try {

            const response = await axios.post(`${API_URL}/api/${route}/login`, data);
            // console.log(response.data.data)
            if (response.data.result) {
                localStorage.setItem("token", response.data.token);
                toast.success(response.data.message);
                dispatch(setNewUser({
                    _id: response.data.data._id,
                    name: response.data.data.name,
                    role: response.data.data.role,
                }))
                if(response.data.data.role === "Super Admin"){
                    navigate("/adminDashboard");
                }
                else{
                    navigate("/home");
                }
            }
            else {
                toast.error(response?.data.message);
            }
        } catch ({ response }) {
            toast.error(response?.data.message);
        }
        finally {
            setIsLoading(() => false);
        }
    }


    const changeRole = useCallback((value) => {
        setData((old) => ({ ...old, role: value }))

    })


    const roles = [{ name: "Faculty" }, { name: "Student" }];


    return (
        <>

            {
                isLoading &&
                <Overlay />
            }


            <section className='flex justify-center items-center my-5'>
                <section className='p-5 md:p-10 shadow-2xl bg-white rounded-lg m-5 '>
                    <p className='text-2xl text-center text-red-500'>Login</p>
                    <form method="post" onSubmit={submitHandler} className='p-4'>
                        <section className="md:p-2 md:m-2 p-1 m-1">
                            <label className='mx-2'>Select Your Role : </label>
                            <Dropdown dataArr={roles} selected={data?.role} setSelected={changeRole} label={"Select Your Role"} />
                            {
                                errors.roleErr!==""
                                &&
                                <p className="text-red-500">
                                    {
                                        errors.roleErr
                                    }
                                </p>
                            }
                        </section>
                        {
                            data.role === "Faculty"
                            &&
                            <section className='md:p-2 md:m-2 p-1 m-1' >
                                <label htmlFor="email">Email:</label>
                                <input type="email" name="email" value={data.email} onChange={updateData} placeholder='Enter Email' className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1' required />
                            </section>
                        }
                        {
                            data.role === "Student"
                            &&
                            <section className="px-3 my-4">
                                <label className='mx-2'>Enter Your SID : </label>
                                <input type="text" name="sid" className='px-3 py-3 rounded-lg shadow-lg w-full' placeholder='Enter Your Sid' value={data?.sid} onChange={updateData} onKeyDown={handleNumericInput} required />
                            </section>
                        }
                        {
                            data?.role !== ""
                            &&
                            <section className='md:p-2 md:m-2  p-1 m-1'>
                                <label htmlFor="Password">Password:</label>
                                <input type="Password" name="password" value={data.password} onChange={updateData} placeholder='Enter Password' className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1' required />
                            </section>
                        }
                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <input type="submit" value="Login" className='text-red-500 cursor-pointer bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                        </section>
                    </form>
                    <button className='text-red-500 border-none bg-white float-right mx-5 flex justify-between gap-2 items-center'
                        onClick={() => setOpenForgotPasswordModal((old) => !old)}
                    >Forgot Password
                        <LoginIcon />
                    </button>
                </section>
            </section>
            <ForgotPassword openForgotPasswordModal={openForgotPasswordModal} setOpenForgotPasswordModal={setOpenForgotPasswordModal} />
        </>
    )
}
