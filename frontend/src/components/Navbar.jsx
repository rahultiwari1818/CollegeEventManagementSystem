import React, { useLayoutEffect, useState } from 'react'
import CollegeLogo from "../assets/images/CollegeLogo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as HamburgerIcon } from "../assets/Icons/HamburgerIcon.svg";
import { ReactComponent as CloseIcon } from "../assets/Icons/CloseIcon.svg";
import { ReactComponent as ProfileIcon } from "../assets/Icons/Profile.svg"
import { ReactComponent as LoginIcon } from "../assets/Icons/LoginIcon.svg";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, setNewUser } from '../store/UserSlice';
import PopoverComponent from './PopoverComponent';

import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Navbar() {

  const [openSideBar, setOpenSideBar] = useState(false);
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const API_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.UserSlice);
  console.log(userData)


  const closeSideBar = () => {
    setOpenSideBar(() => !openSideBar);
  };


  const logoutHandler = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
  }


  useLayoutEffect(() => {
    if (location.pathname === "/") return;
    // console.log("location", location.pathname)
    const fetchData = async () => {
      try {
        const { data } = await axios.post(`${API_URL}/api/auth/checkIsLoggedIn`, "", {
          headers: {
            "auth-token": token
          }
        });
        setIsLoggedIn((old) => true);
        // console.log(data.user)
        if (location?.pathname === "/login") navigate("/home");
        dispatch(setNewUser(data.user));
      } catch (error) {
        setIsLoggedIn((old) => false);
        // console.error(error.response);
        if (error.response?.status === 401 && location?.pathname !== "/login") {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [location]);


  const userRoutes = [
    {
      to: "addstudents",
      label: "Add Students ",
    },
    {
      to: "viewstudents",
      label: "View Students",
    },
    {
      to: "addfaculties",
      label: "Add Faculties ",
    },
    {
      to: "viewfaculties",
      label: "View Faculties",
    },
  ];

  const eventRoutesForSuperAdmin = [
    {
      to: "addEventType",
      label: "Add Event Types"
    },
    {
      to: "viewEventType",
      label: "View Event Types"
    },
    {
      to: "home",
      label: "View Events",
    },
    {
      to: "generateevent",
      label: "Generate Event",
    },
  ];

  const eventRoutesForFaculties = [
    {
      to: "home",
      label: "View Events",
    },
    {
      to: "generateevent",
      label: "Generate Event",
    },
  ];




  return (



    <nav className='bg-gradient-to-r from-cyan-500 to-blue-500  p-2  top-0 sticky z-10 '>
      <section className='lg:flex items-center  lg:justify-around '>
        <img src={CollegeLogo} alt="logo" className='w-12 h-12 md:h-20 md:w-20  lg:m-0 mx-5' />
        <section className='hidden lg:flex items-center'>
          {
            pathname !== "/"
            &&
            <>

              {
                isLoggedIn === undefined
                  ?
                  <>
                  </>
                  :
                  isLoggedIn ?
                    <>

                      {
                        userData.role === "Super Admin"
                        &&
                        <Link to="/adminDashboard" className='py-3 px-4 border border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500  shadow-lg rounded-lg mx-3' > Dashboard </Link>
                      }

                      {
                        userData.role !== "Super Admin"
                        &&

                        <Link to="/home" className='py-3 px-4 border border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500  shadow-lg rounded-lg mx-3' > Home </Link>
                      }
                      {
                        userData.role === "Student"
                        &&
                        <Link to="/myEvents" className='py-3 px-4 border border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500  shadow-lg rounded-lg mx-3' > My Events </Link>
                      }

                      {
                        userData.role !== "Student" &&
                        <PopoverComponent options={userData.role==="Super Admin" ? eventRoutesForSuperAdmin :eventRoutesForFaculties} label="Manage Events" />
                      }

                      {
                        userData.role === "Super Admin"
                        &&
                        <>
                          <PopoverComponent options={userRoutes} label="Manage Users" />
                          <Link to="/courses" className='py-3 px-4 border border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500  shadow-lg rounded-lg mx-3' > Manage Courses </Link>
                        </>
                      }
                      <ProfilePopOver logoutHandler={logoutHandler} />

                    </>
                    :
                    <section>

                      {/* <Link to="login" className='py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' > Login </Link> */}
                    </section>
              }

            </>
          }
        </section>

      </section>

      <section className='lg:hidden'>
        {
          !openSideBar &&
          <button className='fixed z-10 top-4 md:top-6 right-10 bg-white p-2 rounded ' onClick={() => closeSideBar()}>
            <HamburgerIcon />
          </button>
        }
        {
          openSideBar &&
          <button className='fixed z-10 top-4 md:top-6 right-10 bg-white p-2 rounded ' onClick={() => closeSideBar()}>
            <CloseIcon />
          </button>
        }
        {
          openSideBar &&
          <section className='lg:hidden fixed h-screen bg-gradient-to-r from-cyan-500 to-blue-500  right-0 top-0 w-2/3'>
            {
              pathname !== "/"
              &&
              <section className='m-5 '>

                {
                  isLoggedIn === undefined
                    ?
                    <>
                    </>
                    :
                    isLoggedIn ?
                      <>

                        <section className={`flex justify-center items-center w-full ${userData.role === "Student" ? "mt-[20vh]" : "mt-[15vh]"}  mb-[5vh]`}>
                          <section className='bg-white py-3 px-3 rounded-full cursor-pointer w-fit'>
                            <Link to="/profile" onClick={closeSideBar}>
                              <ProfileIcon className={`${userData.role === "Student" ? "md:h-[10vh] md:w-[10vw] h-[11vh] w-[12vh]" : "md:h-[8vh] md:w-[8vw] h-[8vh] w-[8vh]"} `} />
                            </Link>
                          </section>
                        </section>

                        {
                          userData.role === "Super Admin"
                          &&
                          <Link to="/adminDashboard" className='w-full block py-3 px-4 hover:border hover:border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500   shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()} > Dashboard </Link>
                        }

                        {
                          userData.role !== "Super Admin"
                          &&

                          <Link to="/home" className=' w-full block py-3 px-4 hover:border hover:border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500   shadow-lg rounded-lg mx-3 my-2' onClick={() => closeSideBar()} > Home </Link>
                        }
                        {
                          userData.role === "Student"
                          &&
                          <Link to="/myEvents" className=' w-full block py-3 px-4 hover:border hover:border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500   shadow-lg rounded-lg mx-3 my-2' onClick={() => closeSideBar()} > My Events </Link>
                        }

                        {
                          userData.role !== "Student" &&
                          <PopoverComponent options={userData.role==="Super Admin" ? eventRoutesForSuperAdmin :eventRoutesForFaculties} label=" Events" closeSideBar={closeSideBar}/>
                        }

                        {
                          userData.role === "Super Admin"
                          &&
                          <>
                            <PopoverComponent options={userRoutes} label=" Users" closeSideBar={closeSideBar} />
                            <Link to="/courses" className='py-3 px-4 hover:border hover:border-white  hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white bg-white text-blue-500  shadow-lg rounded-lg mx-3 my-3 block w-full' onClick={closeSideBar}>  Courses </Link>

                          </>
                        }


                        <Link to="login" className={` w-full block py-3 px-4 hover:text-red-500 hover:bg-white bg-red-500  text-white shadow-lg rounded-lg mx-3  ${userData.role === "Student" ? "my-4" : ""}`} onClick={() => {
                          logoutHandler();
                          closeSideBar();
                        }} >
                          <section className='flex justify-between items-center gap-3'>

                            <p>Logout</p>
                            <LoginIcon className="outline outline-white  bg-white" />
                          </section>
                        </Link>


                      </>
                      :
                      <section>

                        {/*<Link to="login" className='block my-3 py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()} > Login </Link>*/}
                      </section>


                }

              </section>
            }

          </section>
        }
      </section>




    </nav>
  )
}


const ProfilePopOver = ({ logoutHandler }) => {


  return (
    <>

      <div className="mx-3">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className={'bg-white p-2 rounded-full cursor-pointer'}>
                <ProfileIcon />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-1/2 z-10 mt-3   -translate-x-1/2 transform px-2 ">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                    <div className="relative bg-white">
                      <Link
                        to="profile"
                        className="block w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500  text-white  hover:border shadow-lg"
                      >
                        View Profile
                      </Link>
                      <Link
                        to="login"
                        className=" w-full py-3 px-4 bg-red-500 text-white hover:text-red-500 hover:bg-white  hover:border shadow-lg flex items-center justify-between gap-3"
                        onClick={logoutHandler}
                      >
                        <p>Logout</p>
                        <LoginIcon className="outline-white bg-white" />
                      </Link>
                    </div>

                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </>
  )
}





