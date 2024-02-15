import React, {  useLayoutEffect, useState } from 'react'
import CollegeLogo from "../assets/images/CollegeLogo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as HamburgerIcon } from "../assets/Icons/HamburgerIcon.svg";
import { ReactComponent as CloseIcon } from "../assets/Icons/CloseIcon.svg";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logoutUser, setNewUser } from '../store/UserSlice';
import Popover from './Popover';
export default function Navbar() {

  const [openSideBar, setOpenSideBar] = useState(false);
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const API_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const closeSideBar = () => {
    setOpenSideBar(() => !openSideBar);
  };


  const logoutHandler = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
  }

  // console.log(isLoggedIn, "is logged in")

  useLayoutEffect(() => {
    if (location.pathname === "/") return;

    const fetchData = async () => {
      try {
        const { data } = await axios.post(`${API_URL}/api/auth/checkIsLoggedIn`, "", {
          headers: {
            "auth-token": token
          }
        });
        setIsLoggedIn(() => true);
        if (location?.pathname === "/login") navigate("/home");
        dispatch(setNewUser(data.user));
      } catch (error) {
        setIsLoggedIn(() => false);
        console.error(error.response);
        if (error.response?.status === 401 && location?.pathname !== "/login") {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [location]);


  const studentsRoutes = [
    {
      to: "addstudents",
      label: "Add Students ",
    },
    {
      to: "viewstudents",
      label: "View Students",
    }
  ];

  const facultiesRoutes= [
    {
      to :"addfaculties",
      label:"Add Faculties"
    },
    {
      to :"viewfaculties",
      label:"View Faculties"
    }
  ];

  return (



    <nav className='bg-blue-500 p-2  top-0 sticky z-10 '>
      <section className='lg:flex items-center  lg:justify-around '>
        <img src={CollegeLogo} alt="logo" className='w-20 h-20 md:h-24 md:w-24 lg:h-32 lg:w-32' />
        <section className='hidden lg:flex'>
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
                      <Link to="/home" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Home </Link>
                      <Link to="generateevent" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Generate Event </Link>
                      <Popover options={studentsRoutes} label="Students" />
                      <Popover options={facultiesRoutes} label="Faculties" />
                      <Link to="login" className='py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' onClick={logoutHandler} > Logout </Link>
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
          <button className='fixed z-10 top-10 right-10 bg-white p-2 rounded ' onClick={() => closeSideBar()}>
            <HamburgerIcon />
          </button>
        }
        {
          openSideBar &&
          <button className='fixed z-10 top-10 right-10 bg-white p-2 rounded ' onClick={() => closeSideBar()}>
            <CloseIcon />
          </button>
        }
        {
          openSideBar &&
          <section className='lg:hidden fixed h-screen bg-blue-500 right-0 top-0 w-2/3'>
            {
              pathname !== "/"
              &&
              <section className='m-5 absolute bottom-[10vh]'>

                {
                  isLoggedIn === undefined
                    ?
                    <>
                    </>
                    :
                    isLoggedIn ?
                      <>
                        <Link to="/home" className=' w-full block py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()} > Home </Link>
                        <Link to="generateevent" className='w-full block my-3 py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()}> Generate Event </Link>
                        <Popover options={studentsRoutes} label="Students" closeSideBar={closeSideBar}/>
                        <Popover options={facultiesRoutes} label="Faculties" closeSideBar={closeSideBar}/>

                        <Link to="login" className='py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' onClick={() => {
                          logoutHandler();
                          closeSideBar();
                        }} > Logout </Link>
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
